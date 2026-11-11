---
name: venue-format
description: "Check a paper against its target venue's submission rules: template and class options, page and word limits, anonymization for blind review, required sections and statements, abstract and keyword rules, figure and font requirements, and bibliography style. Use before submitting to a journal or conference, when switching templates (e.g. Elsevier elsarticle, IEEE Access, IEEEtran, ACM, Springer LNCS, NeurIPS), or for /venue-format."
---

# venue-format

Desk rejections are often formatting. Check the rules from the venue's own page, not from memory.

## Steps

1. Identify the venue and article type, and fetch its current author guidelines page (guide for authors / call for papers) with the harness's web tool. Record the URL and date. If you cannot fetch it, say so and ask the user for the rules; do not rely on memory for limits.
2. Extract a checklist from the guidelines: template/class, page or word limit (and what counts: references? appendix?), abstract word limit, keywords count, required sections or statements (data availability, CRediT author roles, funding, conflict of interest, ethics, code availability), highlights (Elsevier: usually 3-5 bullets, each up to 85 characters), graphical abstract, anonymization, figure formats and resolution, reference style.
3. Check the paper against each item:
   - Template: `\documentclass` and options match (e.g. `elsarticle` with `preprint`/`review`, `5p` for final; IEEE Access `ieeeaccess.cls`). The bibliography style matches (`elsarticle-num`, `elsarticle-harv`, `IEEEtran`, etc.).
   - Length: build (latex-build) and report the page count; count abstract words; check highlights character counts.
   - Required statements present and in the right place.
   - Blind review: no author names, affiliations, acknowledgements, self-identifying links or first-person self-citations ("our previous work [12]"); check PDF metadata (`\hypersetup{pdfauthor=...}`) too.
   - Figures: readable at print size (fonts not smaller than the body's footnote size), vector where possible, color-safe, all referenced in the text.
   - No leftover template text, `\TBD`, `TODO`, `??` or `[?]` in the PDF.
4. Report the checklist with PASS / FAIL / CHECK-BY-HAND per item and the evidence (page count, word counts, file:line).
5. Fix only formatting items with the user's go-ahead (via latex-edit). Content cuts to meet a page limit are the user's call; propose them, ranked by least loss.

## Stop when

- Every checklist item has a status with evidence and the guideline URL is cited.

## Rules

- Never guess a limit. If the guideline is ambiguous, quote it and mark CHECK-BY-HAND.
- Do not switch templates or class options without asking; it changes layout and page count.
