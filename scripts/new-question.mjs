#!/usr/bin/env node
// Scaffold a question folder:
//   npm run new -- js <topic-id> <slug> ["Title"]    (also registers it in content/js/topics.json)
//   npm run new -- dsa <topic-id> <slug> ["Title"]   (also registers it in content/dsa/topics.json)
//   npm run new -- react <slug> ["Title"]
//   npm run new -- vanilla <slug> ["Title"]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const type = args[0];
const hasTopic = type === 'js' || type === 'dsa';
const topic = hasTopic ? args[1] : undefined;
const [slug, titleArg] = hasTopic ? args.slice(2) : args.slice(1);
const DIRS = { js: `content/js/${topic}`, dsa: `content/dsa/${topic}`, react: 'content/machine-coding/react', vanilla: 'content/machine-coding/vanilla' };
const usage = () => {
  console.error('Usage: npm run new -- <js|dsa> <topic-id> <slug> ["Title"]\n       npm run new -- <react|vanilla> <slug> ["Title"]');
  process.exit(1);
};

if (!DIRS[type] || !slug || !/^[a-z0-9-]+$/.test(slug)) usage();

const topicsPath = `content/${type}/topics.json`;
const topics = hasTopic ? JSON.parse(readFileSync(topicsPath, 'utf8')) : [];
const topicDef = topics.find((t) => t.id === topic);
if (hasTopic && !topicDef) {
  console.error(`Unknown topic "${topic}". Topics: ${topics.map((t) => t.id).join(', ')}`);
  process.exit(1);
}

const dir = join(DIRS[type], slug);
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

const title = titleArg ?? slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const fnName = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^\d+/, '');
const order = topicDef ? topicDef.problems.length + 1 : undefined;

const readme = `---
title: ${title}
type: ${type}
difficulty: medium
${hasTopic ? `topic: ${topic}\norder: ${order}\n` : ''}${type === 'dsa' ? 'neetcode: false\n' : ''}tags: []
estimatedMinutes: 20
---

Describe the problem in your own words.

## Examples

## Notes

Approach, complexity and follow-ups. Shown only after the solution is revealed or accepted.
`;

const files = { 'README.md': readme };

if (type === 'js') {
  files['starter.js'] = `export default function ${fnName}() {\n  // Your code here\n}\n`;
  files['solution.js'] = `export default function ${fnName}() {\n  // Reference solution\n}\n`;
  files['solution.test.js'] = `import ${fnName} from './solution.js';\n\ndescribe('${fnName}', () => {\n  test('example: works', () => {\n    expect(${fnName}()).toBe(undefined);\n  });\n\n  test('example: calls back', () => {\n    const spy = jest.fn();\n    spy(1);\n    expect(spy).toHaveBeenCalledWith(1);\n  });\n});\n`;
} else if (type === 'dsa') {
  files['starter.js'] = `/**\n * @param {number[]} nums\n * @return {number}\n */\nexport default function ${fnName}(nums) {\n  // Your code here\n}\n`;
  files['solution.js'] = `/**\n * @param {number[]} nums\n * @return {number}\n */\nexport default function ${fnName}(nums) {\n  return nums.length;\n}\n`;
  files['cases.json'] = `${JSON.stringify(
    {
      fn: fnName,
      kind: 'function',
      params: [{ name: 'nums', type: 'number[]' }],
      returns: 'number',
      compare: 'exact',
      cases: [
        { input: [[1, 2, 3]], expected: 3 },
        { input: [[4]], expected: 1 },
        { input: [[]], expected: 0, hidden: true },
        { input: [[1, 1]], expected: 2, hidden: true },
        { input: [[-1, 0, 1, 2]], expected: 4, hidden: true },
      ],
    },
    null,
    2,
  )}\n`;
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

if (topicDef) {
  topicDef.problems.push(slug);
  // One topic per line, matching the hand-written topics.json files.
  const line = (t) =>
    `{ ${Object.entries(t)
      .map(([k, v]) => `${JSON.stringify(k)}: ${Array.isArray(v) ? `[${v.map((x) => JSON.stringify(x)).join(', ')}]` : JSON.stringify(v)}`)
      .join(', ')} }`;
  writeFileSync(topicsPath, `[\n${topics.map((t) => `  ${line(t)}`).join(',\n')}\n]\n`);
}

console.log(`Created ${dir}/ (${Object.keys(files).join(', ')})`);
if (topicDef) console.log(`Registered "${slug}" as #${order} in ${topicsPath} (topic "${topic}").`);
console.log('Delete the solution file(s) if you only want the prompt for now.');
