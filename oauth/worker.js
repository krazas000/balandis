/**
 * GitHub OAuth for Decap CMS — Cloudflare Worker.
 *
 * Two routes:
 *   GET /auth      → send the browser to GitHub's login page
 *   GET /callback  → GitHub sends the user back here with a code; we swap the
 *                    code for a token and hand the token to the Decap popup's
 *                    opener window with postMessage.
 *
 * Secrets (set with `wrangler secret put`): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 * Var (wrangler.jsonc): ALLOWED_ORIGINS — comma-separated site origins that may
 * receive the token. Example: "https://balandis.pages.dev".
 */

const html = (body) =>
  new Response(`<!doctype html><html><body>${body}</body></html>`, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      if (!env.GITHUB_CLIENT_ID) return new Response("GITHUB_CLIENT_ID is not set", { status: 500 });
      const state = crypto.randomUUID();
      const gh = new URL("https://github.com/login/oauth/authorize");
      gh.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      gh.searchParams.set("scope", "repo,user");
      gh.searchParams.set("state", state);
      gh.searchParams.set("redirect_uri", `${url.origin}/callback`);
      return new Response(null, {
        status: 302,
        headers: {
          location: gh.toString(),
          "set-cookie": `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
        },
      });
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const cookie = request.headers.get("cookie") || "";
      const saved = (cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/) || [])[1];
      if (!code || !state || state !== saved) {
        return html("<p>Login failed: state mismatch. Close this window and try again.</p>");
      }

      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json", "user-agent": "balandis-oauth" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });
      const data = await res.json();

      const allowed = JSON.stringify((env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean));
      const status = data.access_token ? "success" : "error";
      const payload = data.access_token
        ? JSON.stringify({ token: data.access_token, provider: "github" })
        : JSON.stringify({ error: data.error_description || data.error || "unknown error" });
      const message = JSON.stringify(`authorization:github:${status}:${payload}`);

      // Decap's handshake: the popup says "authorizing", the opener answers,
      // then the popup sends the result to the opener's origin.
      return html(`<p>Signing in…</p>
<script>
(function () {
  var allowed = ${allowed};
  function receive(e) {
    if (allowed.length && allowed.indexOf(e.origin) === -1) return;
    window.opener.postMessage(${message}, e.origin);
    window.removeEventListener("message", receive);
  }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>`);
    }

    return new Response("balandis OAuth worker. Routes: /auth, /callback", { status: 404 });
  },
};
