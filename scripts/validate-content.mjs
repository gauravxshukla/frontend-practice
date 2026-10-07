#!/usr/bin/env node
// Checks every question folder has valid frontmatter and the files its type needs.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIFFICULTIES, QUESTION_TYPES, expectedTypeForSlug, parseFrontmatter } from '../src/lib/content/frontmatter.js';
import { KNOWN_TYPES } from '../src/features/runner/core.js';

// JS and DSA questions live in topic folders registered in content/<track>/topics.json.
const topicIndex = (track) =>
  new Map(
    JSON.parse(readFileSync(`content/${track}/topics.json`, 'utf8')).flatMap((t) =>
      t.problems.map((p, i) => [p, { topic: t.id, order: i + 1 }]),
    ),
  );
const TOPIC_OF = { js: topicIndex('js'), dsa: topicIndex('dsa') };
const COMPARES = ['exact', 'unordered', 'unordered-deep', 'float', 'checker'];
const KINDS = ['function', 'design', 'codec'];

function validateCases(folder, fail) {
  let spec;
  try {
    spec = JSON.parse(readFileSync(join(folder, 'cases.json'), 'utf8'));
  } catch (e) {
    return fail(`cases.json is missing or invalid JSON (${e.message})`);
  }
  const kind = spec.kind ?? 'function';
  if (!KINDS.includes(kind)) fail(`cases.json: kind must be one of ${KINDS.join(', ')}`);
  if (!COMPARES.includes(spec.compare ?? 'exact')) fail(`cases.json: compare must be one of ${COMPARES.join(', ')}`);
  if (spec.compare === 'checker' && !existsSync(join(folder, 'checker.js'))) fail('compare: "checker" needs checker.js');
  if (kind !== 'design') {
    if (!Array.isArray(spec.params) || !spec.params.length) fail('cases.json: params must be a non-empty array');
    for (const p of spec.params ?? []) {
      if (!p.name || !KNOWN_TYPES.has(p.type)) fail(`cases.json: param ${JSON.stringify(p)} has an unknown type`);
    }
    if (kind === 'function' && !KNOWN_TYPES.has(spec.returns)) fail(`cases.json: unknown returns type ${spec.returns}`);
  }
  if (!Array.isArray(spec.cases)) return fail('cases.json: cases must be an array');
  const visible = spec.cases.filter((c) => !c.hidden).length;
  const hidden = spec.cases.length - visible;
  if (visible < 2) fail(`cases.json: needs at least 2 visible example cases (has ${visible})`);
  if (hidden < 3) fail(`cases.json: needs at least 3 hidden edge cases (has ${hidden})`);
  spec.cases.forEach((c, i) => {
    if (!Array.isArray(c.input)) fail(`cases.json: case ${i + 1} input must be an array of arguments`);
    else if (kind === 'function' && c.input.length !== spec.params.length) fail(`cases.json: case ${i + 1} has ${c.input.length} args, params has ${spec.params.length}`);
    if (!('expected' in c) && spec.compare !== 'checker') fail(`cases.json: case ${i + 1} has no expected`);
  });
}

const ROOTS = ['content/js', 'content/dsa', 'content/machine-coding'];
const errors = [];

function findReadmes(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return findReadmes(path);
    return name === 'README.md' ? [path] : [];
  });
}

const readmes = ROOTS.flatMap(findReadmes);

for (const readme of readmes) {
  const folder = join(readme, '..');
  const slug = relative('content', folder);
  const fail = (msg) => errors.push(`${slug}: ${msg}`);
  const { data, body } = parseFrontmatter(readFileSync(readme, 'utf8'));

  if (!data.title) fail('missing `title`');
  if (!QUESTION_TYPES.includes(data.type)) fail(`\`type\` must be one of ${QUESTION_TYPES.join(', ')}`);
  else if (data.type !== expectedTypeForSlug(slug)) fail(`\`type: ${data.type}\` doesn't match its folder (expected ${expectedTypeForSlug(slug)})`);
  if (!DIFFICULTIES.includes(data.difficulty)) fail(`\`difficulty\` must be one of ${DIFFICULTIES.join(', ')}`);
  if (data.tags !== undefined && !Array.isArray(data.tags)) fail('`tags` must be an inline array, e.g. [arrays, hashing]');
  if (!body.trim()) fail('README has no prompt');

  if (data.type === 'js' || data.type === 'dsa') {
    if (!existsSync(join(folder, 'starter.js'))) fail('missing starter.js');
  }
  if (data.type === 'js' && !existsSync(join(folder, 'solution.test.js'))) fail('missing solution.test.js');
  if (data.type === 'dsa') validateCases(folder, fail);
  if (data.type === 'js' || data.type === 'dsa') {
    const track = data.type;
    const name = slug.split('/').pop();
    const expected = TOPIC_OF[track].get(name);
    if (!expected) fail(`not listed in content/${track}/topics.json`);
    else {
      if (slug !== `${track}/${expected.topic}/${name}`) fail(`should live in content/${track}/${expected.topic}/${name}`);
      if (data.topic !== expected.topic) fail(`frontmatter topic should be ${expected.topic}`);
      if (data.order !== expected.order) fail(`frontmatter order should be ${expected.order}`);
    }
  }
  if (data.type === 'react' && !existsSync(join(folder, 'starter/App.js'))) fail('missing starter/App.js');
  if (data.type === 'vanilla' && !existsSync(join(folder, 'starter/index.js'))) fail('missing starter/index.js');
}

if (errors.length) {
  console.error(`✗ ${errors.length} content problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${readmes.length} questions valid`);
