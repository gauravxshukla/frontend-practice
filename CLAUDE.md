# frontend-practice

A static Vite + React 19 + TypeScript app (deployed to GitHub Pages) for practising frontend
interviews: JS questions graded by Jest-style suites, DSA in JS / Python (Pyodide) / Java
(CheerpJ), and machine-coding questions in Sandpack. Questions live in `content/`; the app in `src/`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app (Vite, http://localhost:5173) |
| `npm run build` | Type-check (`tsc`, including `test/`) and build. This is the typecheck gate. |
| `npm run verify` | Validate content, then run every test (Vitest) |
| `npx vitest run test/lib/drafts.test.ts` | Run one test file |

There is no lint script.

## Tests: always under `test/`

**This rule overrides any global instruction to co-locate tests with the code.**

- Every test goes in the root `test/` folder, **mirroring the path of the code it tests under `src/`**:
  `src/lib/drafts.ts` → `test/lib/drafts.test.ts`,
  `src/features/palette/rank.ts` → `test/features/palette/rank.test.ts`.
  Never create a `*.test.*` or `*.spec.*` file under `src/` or `scripts/`
  (`test/repo/testLocation.test.js` fails if you do).
- Import the code under test with a relative path into `src/`
  (`import { parseDraft } from '../../src/lib/drafts';`).
- Name files `<module>.test.ts` (or `.js` for JS modules), one per module under test. Tests that need Node
  APIs (`node:fs`…) are `.js`: the project has no `@types/node`.
- Other folders in `test/`:
  - `test/content/` verifies the question content (DSA `cases.json`, JS suites under mini-Jest, Python and Java solutions).
  - `test/repo/` holds repository-wide guards (test location, colour tokens).
  - `test/setup.js` is the Vitest setup file.
- **Exception:** `content/**/solution.test.js` are part of a question (the app runs them in the
  browser), so they stay next to their question. They are not app tests.
- Vitest runs in Node, so tests cover pure logic and modules. UI behaviour is checked in a real
  browser (Playwright) rather than with component tests.
- New logic gets tests; bug fixes get a test that fails before the fix.

## URLs

- Build and parse every app URL with `src/lib/routes.ts` (`questionUrl`, `groupUrl`, `quizUrl`,
  `notesUrl`, `parseRoute`): questions are `/<track>/<name>` (`/dsa/two-sum`, `/react/data-table/native`),
  topics `/<track>/topics/<topic>`. Old `/q/…` and `/topics/…` links redirect.
  `test/repo/routeStrings.test.js` fails on a hand-written old-style path.

## Styling

- Colours come only from the tokens in `src/index.css`, defined for both light and dark themes.
  Don't write colour literals (`#hex`, `rgb()`, `hsl()`) anywhere else
  (`test/repo/colorTokens.test.js` enforces this).
- Overlays (toasts, tooltips, modals, menus) match the current theme; never invert them.
