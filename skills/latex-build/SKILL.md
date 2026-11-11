---
name: latex-build
description: "Compile a LaTeX paper for real and fix it from the actual .log: first error with file and line, undefined references and citations, missing packages, overfull boxes. Loops until it builds clean, with a round cap. Use after any .tex or .bib edit, when the PDF has ?? or [?], when a build fails, or for /latex-build."
---

# latex-build

"It should compile" is not a build. Run the compiler, read the log, fix what it says.

## Pick the build command

1. If the project has its own build script, use it. Look for `build.py`, `Makefile`, `latexmkrc` / `.latexmkrc`, or a README build line. Example: TerraDistill builds with `python build.py` (it fetches missing packages into `./localtex`).
2. Otherwise use latexmk (MiKTeX is installed with `latexmk`, `pdflatex`, `bibtex`, `biber`, `chktex`):
   - `latexmk -pdf -interaction=nonstopmode -halt-on-error -file-line-error main.tex`
   - Use `-xelatex` or `-lualatex` only if the document needs it (`fontspec`, `unicode-math`).
3. Find the root file: the `.tex` with `\documentclass` that the others `\input` (often `main.tex` or `manuscript.tex`). Build supplementary or highlights files separately if they exist.

## Loop

1. Run the build. Note the exit code.
2. Read the `.log`, not the console tail:
   - First error: the first line starting with `! ` or `<file>:<line>: `. Fix that one first; later errors are often caused by it.
   - `Undefined control sequence`, `Missing $ inserted`, `Runaway argument`: look at the exact line the log names.
   - `File '<x>.sty' not found`: MiKTeX can install on the fly; if it cannot, report the package name. Do not remove the `\usepackage` to make the error go away.
   - Search the log for `undefined` (references and citations), `multiply defined` (labels), `Overfull \hbox` (text past the margin, note the badness and line), `Rerun to get`.
3. Make the smallest fix for the first problem. One fix per round.
4. Rebuild and re-read the log.
5. When the build succeeds, check the log is clean of undefined references/citations, and list remaining overfull boxes over ~10pt with their lines.
6. Optional lint: `chktex -q -n1 -n8 main.tex` for common mistakes; report, do not mass-fix.

## Stop when

- Exit code 0, no undefined references or citations, no multiply-defined labels, and you showed the relevant log lines (`grep -c "undefined" main.log` is 0, page count, PDF timestamp).
- Or 6 rounds without a clean build, or the same error twice after two different fixes. Stop, show the first error with its log context, and use ds-unstick.

## Rules

- Never comment out content, packages, figures or citations to get a clean build unless the user agrees.
- Never edit generated files (files marked "generated ... do not edit", e.g. `generated/*.tex`). Fix the generator or its input and re-run it.
- Do not delete `.aux`/`.bbl` files from the user's folder unless a stale aux is the proven cause; `latexmk -c` is the safe clean.
- Keep the build output files where the project already keeps them.
