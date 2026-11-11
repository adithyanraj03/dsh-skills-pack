---
name: cite-verify
description: "Verify a LaTeX paper's citations: every \\cite key exists in the .bib, and every .bib entry is a real paper whose title, year and authors match Crossref or arXiv. Flags fabricated, mismatched, missing and unused references, and never invents one. Use whenever you add, edit or review citations or a .bib file, before submission, or when the user says check references, verify citations, or /cite-verify."
---

# cite-verify

A citation the model "remembers" may not exist. Every reference must be checked against a real record before it stays in the paper.

## Steps

1. Run the checker on the paper folder (Python stdlib only; network lookups are read-only):

   ```
   python "<skill>/scripts/check_bib.py" "<paper folder>"
   ```

   Options: `--bib refs.bib` to pick one file, `--limit N` for a quick partial check, `--offline` for keys only, `--json out.json` to save findings. Exit 0 = clean, 1 = problems.
2. Read every line of the output. Kinds:
   - `MISSING-IN-BIB`: a `\cite` key with no entry. The PDF shows `[?]`.
   - `NOT-FOUND` / `NOT-FOUND?`: no matching record found. Treat as possibly fabricated until proven otherwise.
   - `TITLE-MISMATCH` / `YEAR-MISMATCH`: the DOI or arXiv id points at a different paper or year than the entry says.
   - `LOOKUP-FAILED`: network error. This is not a pass; re-run or check by hand.
   - `UNUSED`, `ADD-DOI`: notes, not errors.
3. For each problem, check by hand: search the exact title on arXiv / Crossref / Semantic Scholar / Google Scholar with the harness's web tool, or open the DOI. Record the URL you used.
   - Real paper, wrong metadata: fix the entry from the official record (title, authors, year, venue, DOI). Prefer the published version over the arXiv preprint when both exist, unless the paper cites the preprint on purpose.
   - Cannot find it after two searches: do not keep it and do not replace it with a similar-sounding paper. Replace the citation in the text with `\TBD{CITATION NEEDED: <claim>}` if the project defines `\TBD`, otherwise `[CITATION NEEDED]`, and list it for the user.
   - Missing key: find the intended paper and add a verified entry, or mark it as above.
4. If citing for a specific claim, make sure the cited paper actually supports that claim (read its abstract, or the passage). A real paper cited for something it does not say is still a wrong citation.
5. Re-run the checker and the LaTeX build (see latex-build) and show both outputs.

## Stop when

- The checker exits 0 (or every remaining line is explained), the build has no undefined citations, and the report lists each fix with its source URL.

## Rules

- Never write a .bib entry from memory. Every new entry comes from an official record you fetched in this session (Crossref, arXiv, publisher page, DBLP), and you give its URL.
- Never "fix" a fabricated reference by swapping in a different real paper without the user agreeing it supports the claim.
- Do not delete `UNUSED` entries without asking; some are cited in a supplementary file or kept on purpose.
- Keep the `.bib` style of the project (key format, field set, brace style).
