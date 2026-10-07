# Frontend Practice

A local interview-prep app with JavaScript questions, the **NeetCode 150**, machine coding, quizzes and notes. You pick a topic, attempt a question cold in the editor, then **Run** against the examples and **Submit** against hidden edge cases, the way LeetCode works.

```bash
npm install
npm run dev        # http://localhost:5173
```

## How it works

- **Sidebar = topics.** Questions › JavaScript, DSA · NeetCode 150 (18 topics + Sorting Basics), Machine coding › React / Vanilla JS. Quiz decks and notes sections live in the same tree. Each topic shows `solved / total`, and opening a topic shows its questions with status and difficulty filters.
- **JS and DSA questions** use a LeetCode-style workspace:
  - **Run** executes the visible example cases, plus any you edit or add in the **Testcase** tab. For custom inputs, the expected value comes from the reference solution.
  - **Submit** runs every case, including hidden edge cases, and reports **Accepted**, **Wrong Answer** (with input / output / expected), **Runtime Error** (with the line), **Compile Error** or **Time Limit Exceeded**. Accepted marks the question **Solved**.
  - The **Notes** and **Solution** tabs stay locked until you're accepted, unless you choose to reveal them.
  - Code runs in a Web Worker in your browser. It works offline, `console.log` output is captured per case, and infinite loops are stopped after 3s (6s for JS suites).
- **Machine coding** questions get a live preview and console ([Sandpack](https://sandpack.codesandbox.io/), which needs an internet connection), with Reveal solution to compare.
- Your code, solved status, sidebar state, theme and panel sizes are saved in this browser.

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `⌘'` / `Ctrl+'` | Run |
| `⌘↵` / `Ctrl+↵` | Submit |
| `⌘B` / `Ctrl+B` | Collapse or expand the sidebar (opens the drawer on mobile) |
| `/` | Find a topic, question, deck or note |
| `Alt+←` / `Alt+→` | Previous / next question in the same topic |
| `Esc` | Clear the filter, or close the mobile drawer |

## Layout

```
content/                          ← the questions. Adding one never touches src/.
  js/<slug>/                      implement-X questions (polyfills, lodash, async)
  dsa/topics.json                 topic list + NeetCode order (drives the sidebar)
  dsa/<topic>/<slug>/             NeetCode 150 + extras
  machine-coding/{react,vanilla}/<slug>/
  quiz/*.md                       one deck per file
  notes/**/*.md                   rendered as-is, grouped by folder
src/
  app/                            router, layout, sidebar
  features/runner/                judge (core.js), worker, mini-Jest, verdicts
  features/workspace/             question page, code workspace, testcase/result panels, preview sandbox
  features/topic/ catalog/ quiz/ notes/
  lib/                            content loaders, progress, drafts, theme
scripts/                          new-question, validate-content, verify-dsa.test.js
legacy/                           old experiments not part of the app
```

## Adding a question

```bash
npm run new -- js promise-any "Promise.any"
npm run new -- dsa arrays-hashing majority-element "Majority Element"   # also registers it in topics.json
npm run new -- react tabs
npm run new -- vanilla modal-dialog
```

Fill in the files, then run `npm run verify`.

### README.md (every question)

```md
---
title: Two Sum
type: dsa                 # js | dsa | react | vanilla (must match the folder)
difficulty: easy          # easy | medium | hard
topic: arrays-hashing     # dsa only, with order = position in topics.json
order: 3
tags: [arrays, hash-map]
estimatedMinutes: 10
---

The prompt (markdown), in your own words.

## Notes

Approach, complexity, pitfalls, follow-ups. Locked until accepted or revealed.
```

### DSA: `starter.js`, `solution.js`, `cases.json` (+ optional `checker.js`)

Both JS files `export default` the function (or the class, for design problems). `cases.json` is data, so the browser and `npm run verify` grade with the same judge (`src/features/runner/core.js`):

```json
{
  "fn": "twoSum",
  "kind": "function",
  "params": [{ "name": "nums", "type": "number[]" }, { "name": "target", "type": "number" }],
  "returns": "number[]",
  "compare": "unordered",
  "cases": [
    { "input": [[2, 7, 11, 15], 9], "expected": [0, 1] },
    { "input": [[3, 3], 6], "expected": [0, 1], "hidden": true }
  ]
}
```

- **Rules:** `input` is always the argument list. At least 2 visible cases and 3 hidden ones are required.
- **Types:**
  - Plain JSON types: `number`, `string`, `boolean`, `number[]`, `number[][]`, `char[][]` and so on.
  - Data structures, written as JSON: `ListNode` (array), `ListNode[]`, `ListNodeCycle` (`{ "list": [...], "pos": k }`), `TreeNode` (level order with `null`), `TreeNodeRef` (a node value inside param `of`), `GraphNode` (adjacency list), `RandomListNode` (`[[val, randomIndex]]`).
  - Special return types: `TreeNodeVal`, and `void` together with `"mutates": <param index>` for in-place problems.
- **`compare`:** `exact`, `unordered`, `unordered-deep`, `float`, or `checker` (a `checker.js` exporting `(input, output) => boolean`, for problems with many valid answers).
- **`kind`:**
  - `design`: class problems. The input is `[[ops], [args]]`, and the expected value is each op's return.
  - `codec`: round trips, with `"methods": ["serialize", "deserialize"]`.
- **Clone problems:** `"freshNodes": true` rejects answers that reuse input nodes.
- **What `verify` checks:** every reference solution passes all its cases, and every starter fails at least one.

### JS: `starter.js`, `solution.js`, `solution.test.js`

The suite imports `./solution.js` and uses Jest-style globals (`describe`, `test`, `expect`, hooks). In the app it runs in a worker with a small Jest-compatible runner, and in `npm run verify` it runs with Vitest. Stick to common matchers and real timers. **Run** executes tests whose name starts with `example` (or the first two), and **Submit** runs them all.

### Machine coding

- **React:** `starter/App.js` (+ files) and `solution/…`. Sandpack's React template supplies `index.js` and `index.html`.
- **Vanilla:** `starter/index.js`, `styles.css` (+ `index.html` if needed) and `solution/…`.
- **Prompt-only:** leave out the solution and the question shows "No solution yet".

## Quiz format

Any markdown file in `content/quiz/` becomes a deck, so existing notes work as-is:

- Each **numbered heading** (`## 1. Title`, `### 2) Title`, `## 3 — Title`) starts a card. Cards use the shallowest heading level that has numbers. Sub-headings inside an answer must be **deeper** than the card heading.
- If the card contains a line starting with `**Output**`, `**Behavior**` or `**Answer**`, everything before it (the snippet) is shown and everything after it is hidden. A `**Why**` that comes straight after a code block works the same way. Otherwise the whole body is the hidden answer.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app |
| `npm run build` | Type-check and build |
| `npm run new -- …` | Scaffold a question (see above) |
| `npm run validate` | Check frontmatter, topic registration and the `cases.json` schema |
| `npm run verify` | `validate`, then grade every reference solution and check every starter fails (Vitest) |
| `DSA_ONLY=content/dsa/trees npm run test:solutions` | Verify one topic |

## Backlog

Questions mentioned in the old notes that don't exist yet:

- **JS:** `Array.prototype.reduce`, `Function.prototype.call/apply/bind`, EventEmitter, `JSON.stringify`, type utilities, `Promise.any`, promisify, `intersectionBy`/`intersectionWith`, `isEmpty`, `getElementsByClassName`, `getElementsByTagName`, identical DOM tree, table of contents
- **Machine coding:** Accordion II/III, Modal Dialog I–IV, Tabs I–III, Data Table II/III (sorting/filtering)
- **Notes:** `system-design/accessibility/keyboard.md`, `storage/webStorage.md` and `storage/mobileAppStorage.md` are empty and hidden until written
- **Quiz:** HTML/CSS and mobile decks (the old files were empty)
