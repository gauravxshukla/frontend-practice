#!/usr/bin/env node
// Checks every question folder has valid frontmatter and the files its type needs.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIFFICULTIES, QUESTION_TYPES, expectedTypeForSlug, parseFrontmatter } from '../src/lib/content/frontmatter.js';

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
    if (!existsSync(join(folder, 'solution.test.js'))) fail('missing solution.test.js');
  }
  if (data.type === 'react' && !existsSync(join(folder, 'starter/App.js'))) fail('missing starter/App.js');
  if (data.type === 'vanilla' && !existsSync(join(folder, 'starter/index.js'))) fail('missing starter/index.js');
}

if (errors.length) {
  console.error(`✗ ${errors.length} content problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${readmes.length} questions valid`);
