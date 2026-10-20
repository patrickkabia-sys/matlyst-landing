# Language Choice and First-Visit Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-route only first-time Swedish and Danish browser locales from Norwegian pages, and expose an accessible top and bottom language switcher on every nb/sv/da/en page.

**Architecture:** Keep `scripts/locale-sider.mjs` as the counterpart/hreflang source, let the locale generator inject one universal switcher into handwritten and generated pages, and reduce `locale.js` to a post-load first-visit decision on Norwegian pages. Add focused VM tests plus real headless Chromium tests for locale and persistence behavior.

**Tech Stack:** Static HTML/CSS, browser JavaScript, Node.js tests, Playwright Chromium.

**Spec:** Patrick’s decision dated 2026-10-19; landing PR #10 is already merged.

## Global Constraints

- Stack this branch on privacy PR #21 and do not merge either PR.
- Auto-routing runs client-side after load, only on a Norwegian page, only once, and only for primary `sv` or `da` browser locales.
- Direct `/sv/`, `/da/`, and `/en/` visits never auto-route; neither do robots or technical callback/unsubscribe pages.
- A language-switcher choice is explicit, stored, and prevents future auto-routing; choosing Norwegian must be durable.
- Preserve reciprocal hreflang and make `x-default` point to the bokmål counterpart when one exists.
- Switchers use real links to page counterparts, `aria-label`, `aria-current`, and native keyboard behavior.
- Commit with the requested Claude co-author and session trailers.

## Review Focus

- No redirect loop, no secondary-language scanning, and no redirect caused by a previously auto-selected language.
- Generator output is idempotent and includes both switchers on every tabulated page.
- URL query and fragment survive the one allowed automatic redirect.
- Playwright covers `sv-SE`, `da-DK`, `nb-NO`, and `en-US` in headless Chromium.

---

### Task 1: Lock the routing and switcher contract

**Files:**
- Modify: `test/locale-routing.test.mjs`
- Modify: `test/locale-pages.test.mjs`

**Interfaces:**
- Consumes: `locale.js`, `SIDEGRUPPER`, rendered HTML.
- Produces: failing assertions for first-visit-only routing, direct locale URLs, persistence, post-load execution, two accessible switchers, and bokmål x-default.

- [x] **Step 1: Replace legacy all-language redirect expectations with the 19 October decision**
- [x] **Step 2: Add rendered-page assertions for accessible top and bottom switchers**
- [x] **Step 3: Run the focused tests and confirm they fail for the intended old behavior**

### Task 2: Implement the first-visit decision and universal switchers

**Files:**
- Modify: `locale.js`
- Modify: `scripts/locale-sider.mjs`
- Modify: `scripts/generer-lokalsider.mjs`
- Create: `language-switcher.css`
- Regenerate: tabulated nb/sv/da/en HTML and locale sitemaps.

**Interfaces:**
- Consumes: counterpart groups and the Task 1 contract.
- Produces: idempotent rendered switchers and one-time post-load routing.

- [x] **Step 1: Implement durable localStorage/cookie choice and first-visit markers**
- [x] **Step 2: Run routing only after window load and only on Norwegian paths**
- [x] **Step 3: Inject accessible top/bottom switchers and shared CSS on every tabulated page**
- [x] **Step 4: Restore x-default to bokmål where a bokmål counterpart exists**
- [x] **Step 5: Regenerate twice and run focused plus full Node tests**

### Task 3: Add real browser coverage

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `playwright.config.mjs`
- Create: `test/playwright/sprakvalg.spec.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: rendered site and installed Playwright Chromium.
- Produces: headless locale, loop, persistence, and switcher interaction checks.

- [x] **Step 1: Add a local static-server Playwright configuration**
- [x] **Step 2: Test sv-SE, da-DK, nb-NO, and en-US behavior**
- [x] **Step 3: Test no loop, stored Norwegian choice, and both switchers**
- [x] **Step 4: Run Playwright headless Chromium and the full Node suite**
  - Local Node suite passes. The managed macOS sandbox blocks Chromium startup;
    GitHub Actions passed the same headless suite in Chromium.
- [x] **Step 5: Commit with required trailers**

### Task 4: Review and open the stacked PR

**Files:**
- Review all branch changes against `origin/fix/anonym-statistikk-personvern`.

**Interfaces:**
- Consumes: Tasks 1–3 and green verification.
- Produces: a pushed branch and draft PR targeting `fix/anonym-statistikk-personvern`.

- [x] **Step 1: Run fresh generator, Node, Playwright, and diff verification**
- [x] **Step 2: Obtain a fresh-context review and address Important/Critical findings**
- [x] **Step 3: Push without force and create a draft PR documenting #10 status and stack order**
