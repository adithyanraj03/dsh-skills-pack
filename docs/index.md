---
layout: default
title: dsh-skills-pack
---

# dsh-skills-pack

**36 agent skills, one install.** A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin that registers a bundled skill pack through dsh's skill registry — research writing, LaTeX builds, experiment discipline, design review, office documents, animation, and Windows shell conventions.

- Served straight from the installed package; nothing is copied into `~/.dsh` or `~/.agents`.
- Your own local skills of the same name always take priority.
- Disabling or uninstalling the plugin removes every bundled skill — no leftovers.
- No postinstall, no build scripts, no native dependencies.

## Install

```sh
dsh plugin --profile web add dsh-skills-pack
dsh --profile web
```

In the desktop app: **Plugins → Add plugin**, paste `https://github.com/adithyanraj03/dsh-skills-pack`, click **Install**, restart.

## What's inside

| Category | Skills |
|---|---|
| Research & writing | academic-unslop, deep-research, lit-review, paper-review, claim-check, cite-verify, rebuttal, venue-format, figure-tables |
| LaTeX & submission | latex-build, latex-edit, arxiv-prep |
| Experiments | experiment, env-doctor |
| Design & code review | ds-design, ds-design-audit, ds-blast-radius, ds-tdd, ds-review-loop, ds-principles, ds-lessons, ds-unslop, ds-unstick |
| Documents & media | docx, pdf, pptx, xlsx, art-motion, reverse-engineer-anything, image-icon |
| Workflow & environment | checkpoint, handoff, secrets-guard, find-skills, win-shell, dsh-plugin-dev |

## How it works

The host half registers one provider on `ctx.skills` at the bundled rank (600). Every local root — project `.dsh/skills` (100), `.agents/skills` (200), custom dirs (300), `~/.dsh/skills` (400), `~/.agents/skills` (500) — shadows a bundled skill of the same name. Discovery parses only YAML frontmatter; bodies load on demand from the package, and each skill's base directory is reported so its `references/`, `scripts/` and `assets/` resolve correctly.

## Links

- [GitHub repository](https://github.com/adithyanraj03/dsh-skills-pack)
- [Full README](https://github.com/adithyanraj03/dsh-skills-pack#readme) · [中文](https://github.com/adithyanraj03/dsh-skills-pack/blob/main/README.zh-CN.md)
- [npm package](https://www.npmjs.com/package/dsh-skills-pack)
- [Releases](https://github.com/adithyanraj03/dsh-skills-pack/releases)

## License

MIT, including bundled third-party notices (art-motion © alchaincyf/Huashu; ds-* © AICodeKing).
