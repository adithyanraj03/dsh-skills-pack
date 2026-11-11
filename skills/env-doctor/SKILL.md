---
name: env-doctor
description: "Check the environment before debugging code: which Python/venv/conda, package versions, CUDA/driver/torch GPU visibility, Node/pnpm versions, and TeX. Use when an import fails, a package 'is installed but not found', a GPU is not used, versions may mismatch, a project worked before and now does not, or before a long training run."
---

# env-doctor

Many "code bugs" are the wrong interpreter, the wrong package version or an invisible GPU. Check the environment in one pass before editing code.

## Steps

Run only the sections relevant to the project, and paste the outputs in a short table.

1. Python
   - `where python` / `which python`, `python --version`, `python -c "import sys; print(sys.executable)"`
   - Is a venv or conda env active, and is it the project's? (`.venv`, `environment.yml`, `requirements.txt`, `pyproject.toml`)
   - The failing package: `python -m pip show <pkg>` and `python -c "import <pkg>; print(<pkg>.__version__, <pkg>.__file__)"`
   - Compare against the project's pinned versions.
2. GPU / CUDA (ML projects)
   - `nvidia-smi` (driver version, CUDA version the driver supports, GPU memory in use)
   - `python -c "import torch; print(torch.__version__, torch.version.cuda, torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else None)"`
   - A CPU-only torch wheel (`+cpu`) or a CUDA build newer than the driver supports are the usual causes of `is_available() == False`.
   - For custom CUDA code: `nvcc --version` and the compute capability the build targets.
3. Node
   - `node --version`, `pnpm --version` / `npm --version`, and the `engines` field of the project's `package.json`.
   - Lock file present and matching the package manager in use.
4. TeX
   - `latexmk --version`, `pdflatex --version`, and whether MiKTeX is allowed to install missing packages on the fly.
5. Summarize: what matches, what mismatches, and the single most likely cause of the reported failure.

## Stop when

- The table is shown and the likely environment cause is named, or the environment is confirmed fine so debugging can move to the code.

## Rules

- Read-only by default. Installing, upgrading or uninstalling packages, drivers or toolchains needs the user's go-ahead, since it can break other projects.
- Prefer fixing inside the project's own venv over changing global installs.
