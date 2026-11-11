---
name: claim-check
description: "Check that every number and empirical claim in a paper matches its source: results tables, generated macros, logs, CSVs or figure scripts, and that the abstract, intro, tables and conclusion agree. Flags unsupported 'significant' or 'state-of-the-art' claims. Use before submission, after results change, after rewriting the abstract or conclusion, or for /claim-check."
---

# claim-check

Numbers drift across revisions: the table is updated, the abstract is not. Every claim needs a source you can open.

## Steps

1. Collect the claims. Go through the abstract, introduction (contributions list), results, discussion and conclusion, plus highlights and supplementary if present. List each sentence that states a number, a comparison ("outperforms", "X% faster"), a superlative ("state-of-the-art", "first"), or significance.
2. Find each claim's source:
   - a number macro (e.g. `\NumRealTest` in `generated/numbers.tex`): find the macro's definition and the script that writes it;
   - a table: the `.tex` table (often `generated/table_*.tex`) and the results file or script behind it;
   - a figure: the plotting script and its data file;
   - a log or CSV in the run folders.
   Use `graft_grep` for macro and file names if the folder is indexed, else grep.
3. Compare. For each claim mark one of:
   - **OK**: matches the source exactly (after the paper's rounding).
   - **MISMATCH**: differs from the source. Give both values and files.
   - **HAND-TYPED**: a number typed in the text that should come from a macro/table. Flag even if it matches today.
   - **UNSUPPORTED**: no source found, or a comparison/superlative without the baseline numbers or test behind it (e.g. "significantly" with no statistical test or seed spread).
   - **INCONSISTENT**: the same quantity is stated differently in two places.
4. Check derived numbers: percentages and "X times faster" recomputed from the table values; averages over the listed items; dataset sizes adding up to their splits.
5. Report a table: claim (short quote + file:line), status, source, fix. Put MISMATCH and INCONSISTENT first.
6. Fix only with the user's go-ahead, and only by: re-running the generator, replacing a hand-typed number with its macro, or rewording an unsupported claim to what the evidence supports. Then rebuild (latex-build).

## Stop when

- Every claim in the list has a status with a source, and the report is written. If fixes were approved, they are applied and the paper builds clean.

## Rules

- Never change a result number to match the text. The source wins; if the source looks wrong, report it.
- Never invent a statistical test result or a p-value. If significance is claimed without a test, mark it UNSUPPORTED.
- Do not edit generated files by hand.
