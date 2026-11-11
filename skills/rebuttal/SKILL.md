---
name: rebuttal
description: "Respond to journal or conference reviewer comments point by point: split the reviews into numbered items, plan a response and a manuscript change for each, apply agreed changes, produce a tracked-changes PDF with latexdiff, and write the response letter. Use for revisions, major/minor revision decisions, rebuttal periods, or when the user shares reviewer comments."
---

# rebuttal

Reviewers check one thing: did you answer each point and where did the paper change. Make both easy to verify.

## Steps

1. Save the reviews to a file (e.g. `reviews.txt`) if they are not already. Split them into numbered items: `R1.1`, `R1.2`, `R2.1`... One concern per item; split compound comments.
2. Snapshot the submitted version before any edit: copy the source folder (or tag/commit in git) so latexdiff has the original. See the `checkpoint` skill.
3. For each item write a plan row: item id, the concern in one line, response type (agree and change / clarify / disagree with evidence / out of scope), the planned manuscript change with section, and whether it needs new experiments. Show the plan to the user and get decisions on new experiments and disagreements before editing.
4. Apply the agreed changes using latex-edit rules. New results come from real runs (see experiment) and generated files (see claim-check), never typed estimates. New references go through cite-verify.
5. Build the revised paper (latex-build), then the tracked-changes PDF:
   - `latexdiff --flatten <old>/main.tex <new>/main.tex > diff.tex` and build `diff.tex`.
   - If latexdiff chokes on math or custom macros, use `--math-markup=0` or exclude the problem environments, and say so. Put the result where the project keeps it (e.g. `track_changes/`).
6. Write the response letter: a short thank-you line, then for each item: the reviewer's comment (quoted), the response, and where it changed ("Section 4.2, p. 9, lines 12-20", or quote the new text). For disagreements, be polite and evidence-based.
7. Check: every item has a response; every "we changed X" is actually in the diff; page and format limits still hold (venue-format).

## Stop when

- Every review item has a response and a location, the revised paper and the diff PDF build, and the letter is written.

## Rules

- Never promise a change that is not in the manuscript.
- Never invent results to satisfy a reviewer. If an experiment is not done, say what was done instead or why it is out of scope.
- Do not argue tone; argue evidence.
