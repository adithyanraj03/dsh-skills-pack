// dsh-skills-pack host half.
//
// Registers the bundled skills/ directory as one provider on the dsh skill
// registry (ctx.skills). Skills are served straight from the installed
// package: nothing is copied into ~/.dsh or ~/.agents, disabling or
// uninstalling the plugin removes every bundled skill, and a user's own
// local skills (project and user roots, ranks 100-500) always shadow a
// bundled skill of the same name (rank 600).
//
// The catalog/body split follows @deepseek-ai/dsh-skill-filesystem: list()
// parses only YAML frontmatter, get() re-reads the file on every load.
// Packaged content is immutable per installed version, so no watcher is
// needed; the registry caches collections until a provider invalidates.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const PROVIDER_NAME = 'dsh-skills-pack'
// Standard precedence for packaged skill providers — the same rank
// @deepseek-ai/dsh-skill exports as BUNDLED_SKILL_RANK. Hard-coded so the
// plugin has no runtime dependency on a host package.
const BUNDLED_RANK = 600
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SKILLS_ROOT = fileURLToPath(new URL('../skills/', import.meta.url))

export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => ({
    name: PROVIDER_NAME,
    list: () => listSkills(ctx.logger),
    get: (candidate) => loadSkill(candidate),
  }))
}

/** Split a skill file into its YAML frontmatter mapping and its body. */
export function parseSkillFile(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text)
  if (!match) throw new Error('missing YAML frontmatter')
  let front
  try {
    front = parseYaml(match[1])
  } catch (error) {
    throw new Error(`bad frontmatter: ${error.message}`)
  }
  if (front === null || typeof front !== 'object' || Array.isArray(front)) {
    throw new Error('frontmatter is not a mapping')
  }
  return { front, body: text.slice(match[0].length) }
}

// The invocation keys accept YAML booleans plus the case-insensitive
// true/false, yes/no, on/off and 1/0 spellings; any other value drops the
// whole skill with a warning, matching the filesystem provider's grammar.
function invocationFlag(value, fallback, key) {
  if (value === undefined) return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', 'yes', 'on', '1'].includes(normalized)) return true
    if (['false', 'no', 'off', '0'].includes(normalized)) return false
  }
  throw new Error(`invalid ${key} value ${JSON.stringify(value)}`)
}

/** Build one registry candidate from parsed frontmatter. Throws on invalid skills. */
export function makeCandidate(front, file, dir) {
  const name = front.name
  if (typeof name !== 'string' || !SKILL_NAME.test(name)) {
    throw new Error(`invalid skill name ${JSON.stringify(name)}`)
  }
  const description = front.description
  if (typeof description !== 'string' || description.length === 0) {
    throw new Error('missing description')
  }
  const candidate = {
    name,
    description,
    invocation: {
      modelInvocable: !invocationFlag(front['disable-model-invocation'], false, 'disable-model-invocation'),
      userInvocable: invocationFlag(front['user-invocable'], true, 'user-invocable'),
    },
    source: 'bundled',
    provider: PROVIDER_NAME,
    rank: BUNDLED_RANK,
    path: file,
    resourceBase: { kind: 'directory', path: dir },
    locator: { file },
  }
  if (front.whenToUse !== undefined) {
    if (typeof front.whenToUse !== 'string') throw new Error('whenToUse must be a string')
    candidate.whenToUse = front.whenToUse
  }
  if (front.metadata !== undefined) candidate.metadata = front.metadata
  return candidate
}

async function listSkills(logger) {
  let entries
  try {
    entries = await readdir(SKILLS_ROOT, { withFileTypes: true })
  } catch (error) {
    logger.warn(`dsh-skills-pack: cannot read skills root ${SKILLS_ROOT}: ${error.message}`)
    return { candidates: [], complete: false }
  }
  const candidates = []
  const seen = new Set()
  for (const entry of entries) {
    let file
    let dir
    if (entry.isDirectory()) {
      dir = path.join(SKILLS_ROOT, entry.name)
      file = path.join(dir, 'SKILL.md')
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      file = path.join(SKILLS_ROOT, entry.name)
      dir = SKILLS_ROOT
    } else {
      continue
    }
    try {
      const { front } = parseSkillFile(await readFile(file, 'utf8'))
      const candidate = makeCandidate(front, file, dir)
      if (seen.has(candidate.name)) {
        logger.warn(`dsh-skills-pack: duplicate skill "${candidate.name}" at ${file} ignored`)
        continue
      }
      seen.add(candidate.name)
      candidates.push(candidate)
    } catch (error) {
      // A directory without SKILL.md is not a skill bundle; skip it silently.
      if (entry.isDirectory() && error.code === 'ENOENT') continue
      logger.warn(`dsh-skills-pack: skipping ${file}: ${error.message}`)
    }
  }
  return candidates
}

async function loadSkill(candidate) {
  const file = candidate.locator.file
  const { front, body } = parseSkillFile(await readFile(file, 'utf8'))
  const loaded = makeCandidate(front, file, path.dirname(file))
  return { ...loaded, content: body }
}
