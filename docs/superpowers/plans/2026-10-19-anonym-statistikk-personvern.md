# Anonymous Usage Analytics Privacy Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the privacy policy on nb, sv, da, and en for the anonymous app analytics flow shipped in app PR #618.

**Architecture:** Keep bokmål hand-written in `personvern.html`; keep sv/da/en canonical copy in `scripts/generer-lokalsider.mjs` and regenerate their HTML. A focused Node test locks the material flow and retention facts across all four rendered policies.

**Tech Stack:** Static HTML, Node.js ESM generator, Node test runner.

**Spec:** User request dated 2026-10-19; app PR #618; app `docs/pending/2026-10-15-anonym-statistikk-prodsteg.md` step 9.

## Global Constraints

- Base this branch on landing PR #20 and do not merge it.
- Do not change the app repository or mark production step 9 complete.
- Never write the phrase “knyttes aldri” or its translations.
- Keep website analytics in `site.js` described as a separate, unchanged flow.
- Update only the privacy-policy dates to 19 October 2026.
- Supabase is on Pro; operational logs are retained for 7 days per the official Supabase documentation.
- Commit with the requested Claude co-author and session trailers.

## Review Focus

- App analytics and website analytics must remain clearly separate.
- Supabase operational logs must not be described as part of the anonymous event payload.
- Withdrawal must stop collection and clear the phone queue; anonymous events cannot be found per person.
- Older app versions must be identified as a temporary pseudonymous legacy flow.
- Generated sv/da/en pages must match the generator exactly.

---

### Task 1: Lock the four-language disclosure contract

**Files:**
- Create: `test/anonym-statistikk-personvern.test.mjs`

**Interfaces:**
- Consumes: the four rendered privacy-policy HTML files.
- Produces: assertions for transport, minimisation, lifecycle, operational logs, legacy flow, legal basis, and forbidden legacy claims.

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run `node --test test/anonym-statistikk-personvern.test.mjs` and confirm failures name missing anonymous-flow disclosures**

### Task 2: Update canonical and rendered privacy copy

**Files:**
- Modify: `personvern.html`
- Modify: `scripts/generer-lokalsider.mjs`
- Modify: `sv/integritet/index.html`
- Modify: `da/privatliv/index.html`
- Modify: `en/privacy/index.html`
- Modify: existing legal-date tests if they intentionally pin the old date.

**Interfaces:**
- Consumes: Task 1’s rendered-policy assertions.
- Produces: accurate, native copy in four languages and generated sv/da/en artifacts.

- [ ] **Step 1: Write the nb disclosure and replace pseudonymous/account-deletion claims**
- [ ] **Step 2: Write native sv/da and service-oriented en copy in the generator**
- [ ] **Step 3: Run `node scripts/generer-lokalsider.mjs`**
- [ ] **Step 4: Run the focused test and then `node --test`**
- [ ] **Step 5: Verify generated files are stable on a second generator run**
- [ ] **Step 6: Commit with required trailers**

### Task 3: Review and open the stacked PR

**Files:**
- Review all branch changes against `origin/fix/juss-bolge1-del2`.

**Interfaces:**
- Consumes: Tasks 1–2 and their green tests.
- Produces: a pushed branch and draft PR targeting `fix/juss-bolge1-del2`.

- [ ] **Step 1: Run fresh full verification and inspect the diff**
- [ ] **Step 2: Obtain a fresh-context review and address Important/Critical findings**
- [ ] **Step 3: Push without force and create a draft PR documenting merge order and the official 7-day source**
