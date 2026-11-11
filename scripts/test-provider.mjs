// dsh-skills-pack test suite: exercises the provider against the bundled
// skills with a fake registry context, then checks the packaging invariants
// (sanitized paths, trimmed showcase). Run: npm test

import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { apply, inject, parseSkillFile, makeCandidate } from '../src/index.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const skillsRoot = path.join(root, 'skills')
let checks = 0
const ok = (condition, message) => {
  assert.ok(condition, message)
  checks += 1
}

const EXPECTED = [
  'academic-unslop', 'art-motion', 'arxiv-prep', 'checkpoint', 'cite-verify',
  'claim-check', 'deep-research', 'docx', 'ds-blast-radius', 'ds-design',
  'ds-design-audit', 'ds-lessons', 'ds-principles', 'ds-review-loop', 'ds-tdd',
  'ds-unslop', 'ds-unstick', 'dsh-plugin-dev', 'env-doctor', 'experiment',
  'figure-tables', 'find-skills', 'handoff', 'image-icon', 'latex-build',
  'latex-edit', 'lit-review', 'paper-review', 'pdf', 'pptx', 'rebuttal',
  'reverse-engineer-anything', 'secrets-guard', 'venue-format', 'win-shell',
  'xlsx',
]

// --- provider registration against a fake ctx ------------------------------
let provider
const warnings = []
const ctx = {
  logger: { warn: (message) => warnings.push(message) },
  skills: {
    registerProvider(create) {
      provider = create({ signal: new AbortController().signal, invalidate() {} })
      return () => {}
    },
  },
}
ok(JSON.stringify(inject) === JSON.stringify(['skills']), 'inject declares the skills service')
apply(ctx)
ok(provider !== undefined && provider.name === 'dsh-skills-pack', 'provider registers as dsh-skills-pack')

// --- discovery --------------------------------------------------------------
const candidates = await provider.list({})
ok(Array.isArray(candidates), 'list() returns an array observation')
ok(candidates.length === EXPECTED.length, `discovers ${EXPECTED.length} skills (got ${candidates.length})`)
assert.deepEqual(candidates.map((c) => c.name).sort(), [...EXPECTED].sort())
checks += 1
for (const candidate of candidates) {
  ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.name), `kebab-case name: ${candidate.name}`)
  ok(candidate.description.length > 0, `description present: ${candidate.name}`)
  ok(candidate.rank === 600, `bundled rank 600: ${candidate.name}`)
  ok(candidate.provider === 'dsh-skills-pack', `provider ownership: ${candidate.name}`)
  ok(candidate.invocation.modelInvocable === true && candidate.invocation.userInvocable === true, `default invocation: ${candidate.name}`)
  ok(candidate.resourceBase.kind === 'directory', `directory resource base: ${candidate.name}`)
  const definition = await provider.get(candidate, {})
  ok(definition.name === candidate.name, `get() name matches: ${candidate.name}`)
  ok(typeof definition.content === 'string' && definition.content.length > 0, `body loads: ${candidate.name}`)
  ok(!definition.content.startsWith('---'), `frontmatter stripped: ${candidate.name}`)
  ok(definition.resourceBase.path === candidate.resourceBase.path, `resource base stable: ${candidate.name}`)
}
ok(warnings.length === 0, `no discovery warnings (got: ${warnings.join('; ')})`)

// --- packaging invariants ----------------------------------------------------
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}
const personal = /C:[\\/]Users[\\/]adith|B:[\\/]Research|\.dsh-n|adithyanraj03@gmail/
let textFiles = 0
for await (const file of walk(skillsRoot)) {
  if (/\.(md|py|js|mjs|json|txt|ya?ml|sh|ps1|toml|cfg)$/i.test(file)) {
    const text = await readFile(file, 'utf8')
    ok(!personal.test(text), `no personal paths in ${path.relative(root, file)}`)
    textFiles += 1
  }
}
const showcase = await readdir(path.join(skillsRoot, 'art-motion', 'assets', 'showcase'))
ok(!showcase.some((name) => name.endsWith('.gif')), 'showcase GIFs trimmed from the pack')
ok(showcase.includes('hero.png'), 'showcase hero.png kept')

// --- frontmatter edge cases --------------------------------------------------
assert.throws(() => parseSkillFile('no frontmatter here'))
checks += 1
assert.throws(() => parseSkillFile('---\nname: [broken\n---\nbody'))
checks += 1
assert.throws(() => makeCandidate({ name: 'Bad_Name', description: 'x' }, 'f', 'd'))
checks += 1
assert.throws(() => makeCandidate({ name: 'ok', description: '' }, 'f', 'd'))
checks += 1
assert.throws(() => makeCandidate({ name: 'ok', description: 'x', 'user-invocable': 'maybe' }, 'f', 'd'))
checks += 1
const strict = makeCandidate(
  { name: 'ok', description: 'x', 'disable-model-invocation': 'yes', 'user-invocable': 'off' },
  'f',
  'd',
)
ok(strict.invocation.modelInvocable === false && strict.invocation.userInvocable === false, 'strict boolean grammar (yes/off)')
const split = parseSkillFile('---\nname: ok\ndescription: "x"\n---\nbody here\n')
ok(split.front.name === 'ok' && split.body === 'body here\n', 'frontmatter/body split')
const flat = makeCandidate({ name: 'flat-skill', description: 'x' }, path.join(skillsRoot, 'flat-skill.md'), skillsRoot)
ok(flat.resourceBase.path === skillsRoot, 'flat file resource base is the root')

console.log(`dsh-skills-pack: ${checks} checks passed (${textFiles} text files scanned, ${EXPECTED.length} skills round-tripped)`)
