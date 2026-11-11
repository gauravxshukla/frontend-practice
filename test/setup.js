// Runs before every JS suite under Vitest so suites are portable between Vitest
// and the in-browser mini-Jest (src/features/runner/miniJest.js):
// - `jest.fn()` / `jest.spyOn()` map to Vitest's `vi`.
// - DOM questions (`env: dom`) get the same linkedom document the worker uses.
import { vi } from 'vitest';
import { installDom } from '../src/features/runner/dom.js';

globalThis.jest = vi;
await installDom();
