---
name: experiment
description: "Discipline for ML, RL, GAN, LLM and benchmark experiments: baseline first, fixed seeds, one change per run, config and metrics logged to files, and every reported number explained and traceable. Use when training or evaluating a model, tuning hyperparameters, comparing methods, running ablations, or producing numbers for a paper."
---

# experiment

A number you cannot reproduce or explain is not a result. Make every run comparable, logged and traceable.

## Before the first run

1. Write the question in one sentence and the metric that answers it, with its direction (higher or lower is better) and the split it is measured on.
2. Pin the setup: dataset version and split files, code commit or checkpoint, library versions (`python -m pip freeze` or the lock file), GPU and driver (`nvidia-smi`).
3. Get a baseline: run the current method, unchanged, and record its number. A new method without a baseline run in the same setup is not a comparison.
4. Do a smoke run first: a tiny subset and a few steps, to prove the pipeline runs end to end and the loss moves. Only then launch the full run.

## Each run

- Fix seeds (Python, NumPy, torch, CUDA, env) and log them. For claims, run at least 3 seeds and report mean and spread.
- Change one thing per run versus the baseline. If you must change two, say so and do not attribute the gain to either.
- Save the full config for the run (a YAML/JSON file next to the outputs), not only the diff.
- Log metrics to a file (CSV/JSONL), not only to the console. Keep run outputs in one folder per run: `runs/<date>-<short-name>/` with config, metrics, logs and the final checkpoint path.
- Long runs go in the background with the harness's background/timeout option. Do not poll with sleep loops. Check the log at sensible intervals.

## Reading results

- Look at the curves, not just the final number: divergence, NaNs, overfitting, a metric that saturates at step 0.
- Explain the number: what limits it (data, capacity, a bug, the eval itself), and confirm the eval measured the right thing (right split, no train/test leakage, the checkpoint you think you loaded).
- A gain smaller than the seed-to-seed spread is not a gain. Say "no clear difference".
- If a result is surprisingly good, suspect a bug first: leakage, a wrong split, evaluating on training data, a metric computed on the wrong tensor.

## Numbers for papers

- Every number that goes into a paper comes from a file a script wrote (e.g. a generated `numbers.tex` / table `.tex`), never typed by hand. If the project already has a generator script, use it; do not edit generated files.
- Record for each reported number: the run folder, seed(s), and the command that produced it.

## Stop when

- The question is answered with numbers from logged runs against a baseline, with seeds and run folders listed.
- Or 3 runs in a row fail to run or produce NaN/divergence. Stop, report the logs, and use ds-unstick before launching more.

## Rules

- Never report a number from a run you did not see finish.
- Never tune on the test set. Use a dev/validation split.
- Never delete or overwrite earlier runs' folders. They are the evidence.
