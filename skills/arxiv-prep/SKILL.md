---
name: arxiv-prep
description: "Prepare a LaTeX paper for arXiv (or any source upload): flatten inputs, strip comments that may hold private notes, include the .bbl, keep only used files, check figure formats and sizes, and prove the bundle compiles on its own in a clean folder. Use when posting a preprint to arXiv, uploading LaTeX sources to a journal system, or for /arxiv-prep."
---

# arxiv-prep

arXiv publishes your source files, comments included. Ship a clean, minimal bundle that builds on its own.

## Steps

1. Build the paper cleanly first (latex-build). Note the root file and the page count.
2. Make the bundle in a new folder (never modify the working folder), e.g. `arxiv_bundle/`:
   - Copy the root `.tex`, all `\input`/`\include` files, used figures, custom `.cls`/`.sty`/`.bst` files and the generated `.tex` files the paper inputs.
   - Include the `.bbl` produced by the build, renamed to match the root file (arXiv does not run biber; with biblatex the `.bbl` must match arXiv's biblatex version, otherwise prefer bibtex).
   - Leave out: `.aux`, `.log`, `.pdf` of the paper itself, `.bib` (optional), unused figures, `track_changes/`, review notes, data, scripts, checkpoints, `.git`, and anything under `graft/`.
3. Strip comments: remove `%` comment lines and trailing comments (keep escaped `\%`), and `\begin{comment}` blocks. A tool such as `arxiv_latex_cleaner` does this; otherwise a careful script. Then grep the bundle for `TODO`, `\TBD`, `FIXME`, names of reviewers, private paths and keys (see secrets-guard).
4. Figures: arXiv's pdflatex accepts PDF/PNG/JPG; convert EPS if needed. Keep the total upload under arXiv's size limit (check the current limit on arxiv.org/help); downsample huge PNGs.
5. Prove it builds alone: copy the bundle to a fresh temp folder, run `pdflatex` twice (no bibtex), and compare: no errors, no `??` or `[?]`, same page count as step 1.
6. Zip the bundle (`.zip` or `.tar.gz`) and report: file list, size, the clean-build evidence, and anything removed that the user might want back.

## Stop when

- The bundle builds in a clean folder with no undefined refs or citations and the same page count, and the file list and size are reported.

## Rules

- Never upload. Submitting to arXiv is the user's action.
- Never modify the working paper folder; all changes happen in the bundle copy.
