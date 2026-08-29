# balandis — project guide for Claude

> Small lookbook website for a handmade-clothing brand. One page. No build step.
> The founder writes the code. The founder's wife edits the content (text,
> colours, photos) through a simple admin page. GitHub: `krazas000/balandis`.

This file is loaded into context each session. Keep it current but **concise** —
history belongs in `LOG.md` and `git log`, not here.

## ⚠ Change logging — REQUIRED every session

**Every time Claude Code makes changes, append an entry to [`LOG.md`](./LOG.md)**
(newest first) before finishing: **date/time**, a **short summary** of what was
done and why, and the **affected files**. This is the founder's audit trail for
tracking down regressions — never skip it, even for small fixes.

## ⚠ Correctness over speed — the founder's standing instruction

**Slow the work down if that is what it takes to do it correctly and
systematically.** Thoroughness is never traded for turnaround. Concretely:

- **Verify against reality, not against reasoning.** Open the page, run the
  thing, look at the result. Reasoned-but-untested fixes fail.
- **Verify the RENDERED page, never the source.** A grep hit, a byte count or a
  source file is a claim. The pixel is the fact. Use Playwright: read
  `innerText`, `getComputedStyle`, `naturalWidth`.
- **Check your own instruments before trusting their verdict.** A regex, a
  heuristic or a test script can fail in the direction that produces alarming
  output. Before reporting a problem in someone else's system, rule out your own.
- **Don't inherit claims — re-check them.** A to-do or a note in a document is
  not proof that something is still true.
- **State impact honestly, including when it is low.** Don't inflate a finding.
- **Say what was not done, and why.** Skipping a risky step is a good decision;
  letting it look finished is not.

## ⚠ Design work — the source artifact is the acceptance test

1. **When work comes with mockups, screenshots or a design file, "done" means:
   every mock screen rendered next to the real screen at the same width, and
   every difference listed.** A text spec is a guide, not the finish line.
   Keep mockups in the repo (`design/mockups/`) so the check is repeatable.
2. **A spec sentence that says "already exists" or "confirmed" is a claim, not a
   fact.** Check it before skipping the work.
3. **The report for design work is a table per screen with three states:
   Done / Done differently (why) / Not done (why).**
4. Say the size of the remaining gap in numbers, never "mostly done".

## ⚠ Communication style — Simplified Technical English (development only)

All development communication follows the writing rules of ASD-STE100. The
founder reads English as a second language. This style makes reports faster to
read and harder to misread.

**Applies to:** chat replies to the founder, LOG.md entries, development docs.
**Does NOT apply to:** the website's visitor-facing copy, code, code comments.

**The rules:**
1. Keep sentences short. Target: 20 words or less.
2. Put one idea in one sentence.
3. Use the active voice. Write "I fixed the bug", not "the bug was fixed".
4. Use simple, common words.
5. Do not use idioms or figurative language.
6. Use one name for one thing, always.
7. Give exact numbers. Write "overflow of 27px", not "a large overflow".
8. Use lists and tables when you report more than two facts.
9. Put the condition or warning first. "Before you deploy, do X."
10. Use technical terms (deploy, commit, viewport) consistently. Explain a new
    technical word in plain words the first time.
11. **Jargon rule.** Do not use technical slang or metaphors. Words to avoid:
    | Do not write | Write instead |
    |---|---|
    | drill | practice test — we break something on purpose to check the repair works |
    | heartbeat | proof-of-life — a small message that shows a process is still running |
    | fail-open | if it breaks, it does nothing and shows the original |
    | cadence | schedule, how often |
    | guard / guardrail | a check that stops an action |
    | blast radius | how much is affected |
    | cooldown | waiting time before the same action is allowed again |
    | dry run | test mode — does everything except the real action |
    | rollback | go back to the previous working version |
    | probe | a check |
    | edge case | a rare situation |
    | pipeline | the chain of steps |
    | mechanism | the tool, the code that does it |
    If a new technical word appears, add it to this table.
12. Answer length: complete answers are welcome. The rules govern sentences, not
    answers. Put the important conclusion first. Put suggestions and detail after.

## ⚠ Code principles — YAGNI, KISS, careful DRY

- **YAGNI.** Do not build code before it is needed. **Propose features to the
  founder and wait. Never build a feature unprompted.** This site is small on
  purpose; unneeded code is the main risk.
- **KISS.** Prefer the simplest working solution. One HTML file, no framework,
  no build step, unless the founder decides otherwise.
- **DRY, with judgment.** Remove duplication when the copies must always change
  together. Keep duplication when the copies can change separately.

## ⚠ Answer format and review — founder guidelines

**A. State confidence and doubts.** For every research answer and general
question: say how confident you are and what causes doubt. Example:
"Confidence: high — checked in the browser" or "Confidence: low — from memory."

**B. Add the "missing question" paragraph.** After a research answer, add one
short paragraph titled **"The biggest thing you are probably missing."** Not
needed for small mechanical tasks.

**C. "What do you suggest?" means discuss first.** Give options with cost and
trade-offs, recommend one, and wait for the founder's choice. Do not implement.

**D. Adversarial review after significant changes.** Before you report "done":
1. Re-read your own diffs as a hostile reviewer. Hunt for bugs.
2. Verify the risky claims against the live site, not only the local file.
3. Report only confirmed findings, with reproduction.

**E. Run `/simplify` after large change sets.** The adversarial review hunts
bugs. `/simplify` hunts complexity. Apply its fixes under YAGNI, KISS, careful DRY.

**F. Estimate task duration before starting.** If the estimate is above 20
minutes, warn the founder before starting and name the main cost driver.

**G. Check LOG.md before starting a requested task.** If the log shows the same
work was done recently and nothing changed since, ask the founder before
redoing it. Proceed without asking when the request is a real follow-up.

## ⚠ Push and publish — ask every time

- **Never push to GitHub without the founder's approval for that push.** One
  approval covers one push. "You do the push" is not a standing permission.
- The same rule applies to any change on a live service (hosting settings,
  DNS, admin accounts): ask first, each time.
- **Never commit secrets.** Tokens and keys go in environment variables or the
  hosting provider's settings, never in the repo.

## Dev environment notes

- **Files with backticks, `$` or backslashes: Write/Edit tool only — never a
  bash heredoc.** Heredocs have eaten `$` characters before.
- Playwright MCP is available. Prefer its **accessibility snapshots over
  screenshots** — they are text, stay diffable, and do not bloat the transcript
  (images once pushed a transcript to 157MB and stalled the UI).

---

## Current state — 2026-08-29

**Who edits what:** the founder edits `index.html` and `oauth/`. The founder's
wife edits `content/*.json` and `photos/` through `/admin`. Do not put text or
colours back into `index.html`.

- `index.html` — layout, CSS and the small script that loads the content.
- `content/site.json` — text, contact links, 7 brand colours.
- `content/pieces.json` — the collection list.
- `photos/` — images. Decap uploads new ones here.
- `admin/` — Decap CMS 3.15.1 (`index.html`) + `config.yml`.
- `oauth/` — Cloudflare Worker `balandis-oauth` for the GitHub login.
  Deploy from that folder: `npx wrangler deploy`. Secrets:
  `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (`npx wrangler secret put`).
  `ALLOWED_ORIGINS` in `wrangler.jsonc` must list the site origin.

**Hosting (decided 2026-08-29):** Cloudflare Pages connected to the GitHub
repo, branch `master`, no build command, output directory `/`. URL
`balandis.pages.dev` for now; a custom domain later. Every commit — from the
founder or from `/admin` — deploys in about 1 minute.

**Local test:** `npx serve -l 8765 -n .` then open http://localhost:8765/.
`fetch` does not work from a `file://` URL, so a server is required.
