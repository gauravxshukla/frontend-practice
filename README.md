# Frontend Practice

A local interview-prep app: pick a question, attempt it cold in an in-browser editor, run tests or see a live preview, then reveal the reference solution.

```bash
npm install
npm run dev        # http://localhost:5173
```

- **Questions**: JavaScript and DSA questions run against tests. Machine-coding questions (React or vanilla JS) show a live preview and console. Your code is saved per question in the browser. **Reset** restores the starter.
- **Quiz**: output-prediction and theory flashcards. The answer stays hidden until you reveal it.
- **Notes**: read-only reference material (system design, DOM cheatsheet).

The sidebar is the main navigation. **Questions** is an accordion (JavaScript, DSA, Machine coding › React / Vanilla JS). Quiz decks and notes are listed the same way. The sidebar collapses to an icon rail, and it remembers that state, the open groups, your theme and the prompt panel width.

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `⌘B` / `Ctrl+B` | Collapse or expand the sidebar (opens the drawer on mobile) |
| `/` | Filter questions, decks and notes |
| `Alt+←` / `Alt+→` | Previous / next question in the same group |
| `Esc` | Clear the filter, or close the mobile drawer |

The editor and runtime are [Sandpack](https://sandpack.codesandbox.io/) (CodeMirror plus CodeSandbox's in-browser bundler), so running code needs an internet connection.

## Layout

```
content/                     ← the questions. Adding one never touches src/.
  js/<slug>/                 implement-X questions (polyfills, lodash, async)
  dsa/<slug>/                algorithms
  machine-coding/react/<slug>/
  machine-coding/vanilla/<slug>/
  quiz/*.md                  one deck per file (see "Quiz format")
  notes/**/*.md              rendered as-is
src/                         the app
  app/                       router + layout
  features/                  catalog, workspace (editor/tests/preview), quiz, notes
  lib/content/               loads content/ with import.meta.glob, parses frontmatter and decks
scripts/                     new-question + validate-content
legacy/                      old experiments not part of the app (Maestro/puppeteer flows, etc.)
```

## Adding a question

```bash
npm run new -- js promise-any "Promise.any"
npm run new -- dsa valid-anagram
npm run new -- react tabs
npm run new -- vanilla modal-dialog
```

This scaffolds the folder. Then fill in the prompt, starter, solution and tests, and run `npm run verify`.

### Folder contract

Every question has a `README.md`:

```md
---
title: Promise.all
type: js            # js | dsa | react | vanilla (must match the folder)
difficulty: medium  # easy | medium | hard
tags: [promises, async]
estimatedMinutes: 20
dependencies: [lodash@4]   # optional, extra npm deps for machine-coding sandboxes
---

The prompt (markdown). Shown while you practise.

## Notes

Approach, complexity, follow-ups, gotchas. Shown only after "Reveal solution".
```

| Type | Files |
| --- | --- |
| `js`, `dsa` | `starter.js`, `solution.js`, `solution.test.js` |
| `react` | `starter/App.js` (+ any other files), `solution/…` |
| `vanilla` | `starter/index.js`, `starter/styles.css` (+ `index.html` if you need custom markup), `solution/…` |

- **JS/DSA:** export the function as `default`. The test file imports `./solution.js`: in the app that's your attempt, and in `npm run verify` it's the reference. Tests use Jest-style globals (`describe`, `test`, `expect`) and must run both in Sandpack and in Vitest, so stick to common matchers and real timers (short `setTimeout` waits) rather than fake timers.
- **React:** Sandpack's React template supplies `index.js` (which imports `./styles.css`) and `public/index.html`. Your `App.js` default export is rendered.
- **Vanilla:** the template supplies an `index.html` with `<div id="app">`.
- **Prompt-only:** leave out `solution.js` / `solution/` and the app shows "No solution yet". `verify` skips its tests.

## Quiz format

Any markdown file in `content/quiz/` becomes a deck, so existing notes work as-is:

- Each **numbered heading** (`## 1. Title`, `### 2) Title`, `## 3 — Title`) starts a card. Cards use the shallowest heading level that has numbers. Sub-headings inside an answer must be **deeper** than the card heading.
- If the card contains a line starting with `**Output**`, `**Behavior**` or `**Answer**`, everything before it (the snippet) is shown and everything after it is hidden. A `**Why**` that comes straight after a code block works the same way. Otherwise the whole body is the hidden answer.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app |
| `npm run build` | Type-check and build |
| `npm run new -- <type> <slug> ["Title"]` | Scaffold a question |
| `npm run validate` | Check frontmatter and required files |
| `npm run verify` | `validate` + run every reference solution against its tests (Vitest) |

## Backlog

Questions mentioned in the old notes that don't exist yet:

- **JS:** `Array.prototype.reduce`, `Function.prototype.call/apply/bind`, EventEmitter, `JSON.stringify`, type utilities, `Promise.any`, promisify, `intersectionBy`/`intersectionWith`, `isEmpty`, `getElementsByClassName`, `getElementsByTagName`, identical DOM tree, table of contents
- **Machine coding:** Accordion II/III, Modal Dialog I–IV, Tabs I–III, Data Table II/III (sorting/filtering)
- **Notes:** `system-design/accessibility/keyboard.md`, `storage/webStorage.md` and `storage/mobileAppStorage.md` are empty and hidden until written
- **Quiz:** HTML/CSS and mobile decks (the old files were empty)
