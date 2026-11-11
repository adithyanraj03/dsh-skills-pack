---
name: academic-unslop
description: "Remove AI and boilerplate tells from research-paper prose and rewrite it in plain, precise academic English, without changing claims, numbers, math or citations. Use when writing or polishing abstracts, introductions, related work, discussion, conclusions, highlights, cover letters or rebuttals, or for /academic-unslop."
---

# academic-unslop

Reviewers notice templated prose and discount the paper for it. Say what was done and found, precisely.

## Tells to remove

Openers and padding
- "In recent years, X has attracted significant attention." Start with the problem or the gap.
- "To the best of our knowledge" on every novelty claim. Use it once, where it is needed, or not at all if the search was thorough.
- "It is worth noting that", "It should be emphasized that", "Notably,". State the point.
- "plays a crucial/pivotal/vital role", "paves the way", "sheds light on", "a myriad of", "delve into", "a testament to", "the realm of", "landscape", "holistic", "robust" (unless tested for robustness), "seamless", "leverage" (say "use").

Overclaiming
- "novel" on every contribution. Say what is new once, concretely.
- "state-of-the-art" without the table that shows it. Name the benchmark and the margin.
- "significantly" without a statistical test. Use the number, or "substantially" with the number.
- "demonstrates" / "proves" for empirical results on one dataset. Use "shows on <dataset>".
- "first" claims. Keep only if the related-work search supports it.

Structure
- Contributions lists where each bullet restates the abstract. Each bullet should be checkable: a method, a dataset, a result with a number.
- Forced groups of three adjectives. Use the real count.
- Trailing "-ing" clauses: "..., highlighting the importance of X". Delete or make it a claim.
- Generic conclusions: "This work opens new avenues for future research." End with the main finding and one concrete next step.
- Em dashes for asides. Use commas, parentheses, or two sentences.

## Rewrite procedure

1. Do not change: numbers, number macros, math, `\cite`/`\ref`/`\label`, technical terms the paper defines, or the strength of a claim. If a claim looks too strong for its evidence, flag it; do not quietly weaken or strengthen it.
2. Name the reader (a reviewer in the field) and what the paragraph must tell them.
3. Delete sentences that do not serve that.
4. Prefer active voice with "we" for what the authors did; passive is fine for standard procedures.
5. One term per concept throughout. Match the paper's notation and spelling convention.
6. Replace vague claims with the number, dataset or condition.
7. Keep one sentence per line in LaTeX (see latex-edit) and rebuild.

## Example

Before: "In recent years, terrain generation has attracted significant attention. Notably, our novel framework seamlessly leverages distillation, paving the way for robust real-time applications."

After: "Real-time terrain generators trade realism for speed. We distill a slow diffusion teacher into a 5.7M-parameter translator that runs at <rate> on <GPU> (Table 2)."
