# LOG — balandis change log

Newest first. One entry per Claude Code session that changes files.

## 2026-08-29 — Split content out of index.html, add Decap CMS admin and OAuth Worker

**What:**
- Moved all editable text and the 7 brand colours to `content/site.json`.
- Moved the collection list to `content/pieces.json`.
- `index.html` now loads both files with `fetch` and fills the page. The CSS
  variables in `:root` stay as fallbacks. Added `esc()` so names with quotes
  or `<` cannot break the HTML.
- Added `admin/index.html` (Decap CMS 3.15.1 from unpkg) and
  `admin/config.yml` (GitHub backend, branch `master`, colour widgets, image
  upload to `photos/`).
- Added `oauth/worker.js` + `oauth/wrangler.jsonc`: a Cloudflare Worker that
  does the GitHub login for Decap (`/auth`, `/callback`). Checks the OAuth
  `state` cookie. Sends the token only to origins in `ALLOWED_ORIGINS`.
- Added `.gitignore`.

**Verified (Playwright, local server, 1200px):** 6 pieces render, 6 images
load at 1200×1600, lightbox opens and closes, 0 console errors. A fake
`site.json` with a new wordmark and `bg: #112233` changed the rendered
heading and the body background — the JSON really drives the page.

**Later the same day:** the founder deployed `balandis-oauth`
(`https://balandis-oauth.kristupas0razas.workers.dev`, checked with curl:
root and `/auth` answer as coded). Put that URL in `admin/config.yml`.
No Pages project was created; the dashboard showed only the old `balandis`
Worker from 2026-06-16, which served the old single-file site. Decision: host
the site on that Worker. Added root `wrangler.jsonc` (static assets) and
`.assetsignore`. Set `ALLOWED_ORIGINS` to
`https://balandis.kristupas0razas.workers.dev`.

**Evening:** founder created the GitHub OAuth app (client id
`Ov23liLIfoGr79mScyue`), set both secrets, redeployed `balandis-oauth`, and
deployed the site Worker from the repo root. Checked with curl:
- `https://balandis.kristupas0razas.workers.dev` serves the new index,
  `/admin/`, `content/*.json`, photos (all 200); `oauth/`, `CLAUDE.md`,
  `wrangler.jsonc` are 404 (hidden by `.assetsignore`).
- `/auth` on the OAuth Worker answers 302 to
  `github.com/login/oauth/authorize` with the right client id, scope
  `repo,user`, a state value, and the `/callback` redirect uri.
One detour: the first `secret put` used the client id as the secret NAME.
Fixed by deleting it and setting `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET`.

**Still open:** the browser login test at `/admin/` (needs the founder's
GitHub session — Claude cannot do it), and whether Workers Builds is
connected to the repo (if not, `/admin` saves commit but do not deploy).

**Affected:** `index.html`, `content/site.json` (new), `content/pieces.json`
(new), `admin/index.html` (new), `admin/config.yml` (new), `oauth/worker.js`
(new), `oauth/wrangler.jsonc` (new), `.gitignore` (new), `CLAUDE.md`.

## 2026-08-29 — Add project guide and change log

**What:** Created `CLAUDE.md` with the working principles copied from the
carbid project (change logging, correctness over speed, STE communication,
YAGNI/KISS/DRY, answer format, push approval). Left out everything specific to
carbid (stack, auth, compliance, design tokens). Created this `LOG.md`.

**Why:** The founder wants the same working rules in every project.

**Decision recorded:** Option B — split content out of `index.html` and add a
Decap CMS admin page so the founder's wife can edit text, colours and photos.

**Affected:** `CLAUDE.md` (new), `LOG.md` (new). No code changed.
