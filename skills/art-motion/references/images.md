# Optional Images: Existing Material and Image Generation by the Current Agent

Image integration has two parts: the agent observes the current tools and calls them under user authorization; the script parses choices, checks artifacts, and saves them into the project. The script does not simulate host tools, does not borrow another agent's login state, and does not automatically switch image APIs.

## Look at the task first, then the configuration

Import existing images directly with `use-image`. Code animation that needs no images skips this page. For new image generation, first read explicit preferences in the rules loaded for this run, then read this tool's configuration; if the user has already asked for generation, execute with the actual tool and existing authorization, and do not force another question just to fill in configuration.

```sh
# S is the skill directory actually loaded for this run
python "$S/scripts/capabilities.py" image-status
python "$S/scripts/capabilities.py" use-image --file original.png --out <project>/images/material.png
```

`preferences.image.mode` supports `unconfigured/off/existing/generate`; provider is the current tool's exact ID or auto. `off` is a preference not to generate by default, and an explicit generation request for this run can override it; `policy.image_generation=deny` is a prohibition, and temporary authorization flags cannot override it. Save an explicit user "no" as policy, not just as mode.

On first missing configuration, ask only about using existing material / allowing the current tool to generate / skipping. `skip --capability image --scope task` is not persisted; `--scope user` means manual enablement going forward. If the user chooses only for this run, do not save it as a long-term default. Existing voice configuration remains valid after upgrade; the newly added image capability remains unselected and is not automatically granted.

## Current tool snapshot

The agent reads names and schemas from the tool list already exposed in the current session (or the host's official tool search), confirms the supported operations, and then writes a task-local snapshot. Do not infer from scanning keys, installed skills, or agent names. If there are no tools, write `tools: []`.

```json
{
  "host": "codex",
  "session_id": "unique ID for this task",
  "observed_at": 0,
  "tools": [{
    "id": "current actual tool ID",
    "kind": "host",
    "operations": ["generate", "edit"],
    "reference_images": true,
    "transparent_background": true,
    "cost": "subscription",
    "network": "cloud"
  }]
}
```

The example is not a capability claim: `observed_at` must contain this run's Unix time, and tool features and IDs must come from this run's actual schema; the snapshot is valid for 15 minutes. host can be codex, claude-code, kimi, or other; kind can be host or mcp. Billing type is subscription/paid_api/unknown/none; network is cloud/local. A subscription does not mean unlimited quota; when billing is unclear, use unknown, never none.

All three hosts follow this general contract. One Codex session having image_gen does not mean every Codex product surface has it; Claude Code/Kimi can also use a suitable MCP image tool if one is exposed—if not, import existing images or provide a note on material still to be produced. Do not invent same-named built-in tools for these two hosts.

## Plan → host execution → acceptance

Request JSON:

```json
{
  "prompt": "image description confirmed by the user",
  "operation": "generate",
  "references": [],
  "transparent_background": true,
  "min_width": 512,
  "min_height": 512
}
```

Use edit for image changes and provide reference files; relative paths are relative to the request JSON. The script verifies that reference images decode and saves their hash; later changes invalidate the old plan.

```sh
python "$S/scripts/capabilities.py" image-plan --request request.json \
  --host-tools current-tools.json --session this-run-id --mode generate \
  --allow-image-generation --allow-cloud --out execution-plan.json
```

Authorization flags only express authorization the user has already given for this run. Uploading reference images to the cloud additionally requires `--allow-reference-upload`; an explicitly paid API requires `--allow-paid-api`; unknown billing requires `--allow-unknown-image-cost`. Long-term permission can be stored in the corresponding policy field. A project can only set deny, never grant these rights. Handle prohibitions first; if several allowed tools still leave no clear choice, return needs_selection and do not guess the platform.

After receiving `host_action_required`, the agent calls the tool according to its real schema; the plan is a semantic requirement, not a cross-platform parameter body. Write a receipt only after generation succeeds:

```json
{
  "status": "success",
  "plan_id": "ID from the execution plan",
  "session_id": "this run's ID",
  "tool_id": "ID of the tool actually called",
  "output_sha256": "SHA256 of the actual output file"
}
```

Keep the actual tool-call record as evidence. The receipt is a call record supplied by the agent, not a signed platform attestation; reading PNG metadata alone cannot prove which model generated it.

```sh
python "$S/scripts/capabilities.py" accept-image --plan execution-plan.json --receipt receipt.json \
  --host-tools current-tools.json --session this-run-id --file host-output.png \
  --out <project>/images/final-material.png --allow-image-generation --allow-cloud
```

Acceptance re-checks current authorization, image-related configuration, tools, session, reference images, file hash, actual dimensions, and transparent pixels. The plan is valid for 1 hour; when the capability snapshot has expired, refresh it first—do not edit the old plan to pretend it is still valid. Do not overwrite if either the original image or a sidecar exists; static PNG/JPEG/WebP are supported and require Pillow, which the tool will not install automatically. Image content and reference identity still need visual checking; hash/dimensions cannot replace looking at the image.

After it passes, copy it into the project and write an adjacent JSON containing dimensions, transparency, SHA, tool ID, plan association, and `provenance: agent_reported_tool_call`. Do not reference agent cache as the project's final material, and do not claim to have verified a model name the server did not return.

## Extension and feedback loop

When adding an image API adapter, first choose a real provider, then implement its authentication, request, output, and error protocols, and write success/failure contract tests. A URL that calls itself OpenAI-compatible does not automatically become a usable backend; this version has no generic API executor or self-installer. Existing MCP tools belong to the current agent's tool channel; execute them according to their schema.

2026-10-08: P2 established the choice → host action → material acceptance interface. Before reuse, read this page and the provider's current tool documentation; for reproducible failures, add tests and fix the underlying logic; write personal preferences only into private configuration. Voice and images are enabled separately, and upgrades do not expand existing authorization. Record deterministic acceptance and visual-quality conclusions separately.
