#!/usr/bin/env node
// Scaffold a question folder: npm run new -- <js|dsa|react|vanilla> <slug> ["Title"]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [type, slug, titleArg] = process.argv.slice(2);
const DIRS = { js: 'content/js', dsa: 'content/dsa', react: 'content/machine-coding/react', vanilla: 'content/machine-coding/vanilla' };

if (!DIRS[type] || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new -- <js|dsa|react|vanilla> <kebab-case-slug> ["Title"]');
  process.exit(1);
}

const dir = join(DIRS[type], slug);
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

const title = titleArg ?? slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const fnName = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

const readme = `---
title: ${title}
type: ${type}
difficulty: medium
tags: []
estimatedMinutes: 20
---

Describe the problem here.

## Examples

## Notes

Approach, complexity and follow-ups. Shown only after revealing the solution.
`;

const files = { 'README.md': readme };

if (type === 'js' || type === 'dsa') {
  files['starter.js'] = `export default function ${fnName}() {\n  // Your code here\n}\n`;
  files['solution.js'] = `export default function ${fnName}() {\n  // Reference solution\n}\n`;
  files['solution.test.js'] = `import ${fnName} from './solution.js';\n\ndescribe('${fnName}', () => {\n  test('works', () => {\n    expect(${fnName}()).toBe(undefined);\n  });\n});\n`;
} else if (type === 'react') {
  // Sandpack's react template supplies index.js (which imports ./styles.css) and public/index.html.
  const app = `export default function App() {\n  return <h1>${title}</h1>;\n}\n`;
  for (const variant of ['starter', 'solution']) {
    files[`${variant}/App.js`] = app;
    files[`${variant}/styles.css`] = 'body {\n  font-family: sans-serif;\n}\n';
  }
} else {
  // Sandpack's vanilla template supplies an index.html with <div id="app">. Add one here only if you need custom markup.
  const js = `import './styles.css';\n\nconst $root = document.getElementById('app');\n$root.textContent = '${title}';\n`;
  for (const variant of ['starter', 'solution']) {
    files[`${variant}/index.js`] = js;
    files[`${variant}/styles.css`] = 'body {\n  font-family: sans-serif;\n}\n';
  }
}

for (const [name, content] of Object.entries(files)) {
  const path = join(dir, name);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
}

console.log(`Created ${dir}/ (${Object.keys(files).join(', ')})`);
console.log('Delete the solution file(s) if you only want the prompt for now.');
