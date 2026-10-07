---
title: Promise.all
type: js
difficulty: medium
topic: promises-async
order: 2
tags: [promises, async, polyfill]
estimatedMinutes: 20
---

Implement `promiseAll(iterable)`, which behaves like `Promise.all()`. Export it as `export default function promiseAll(iterable)`. Don't use the native `Promise.all`.

- Returns a promise that resolves to an array of results **in the same order** as the input, regardless of which input settles first.
- Rejects as soon as **any** input rejects, with that reason. It doesn't wait for the others. If several reject, the **earliest** rejection wins.
- Input items may be plain values (non-promises); treat them as already resolved. Falsy values like `0`, `''` and `undefined` are valid results.
- An empty input resolves to `[]`.

```js
await promiseAll([1, Promise.resolve(2), new Promise((r) => setTimeout(() => r(3), 10))]); // [1, 2, 3]
await promiseAll([Promise.resolve(1), Promise.reject('boom')]); // rejects with 'boom'
```

**Constraints:** the input is an array. Always return a `Promise`, even for empty input.

## Notes

- **Approach:** create the result promise, allocate `results = new Array(n)` and a `remaining = n` counter. For each item, `Promise.resolve(item).then(...)` (or `await item` inside an async callback), write the value to `results[index]`, decrement, and resolve when `remaining` hits 0. Pass `reject` straight through as the rejection handler.
- **Write by index, not `push`:** `push` gives settle order, not input order.
- **Count, don't check `results.length`:** with `new Array(n)` the length is `n` from the start, and a `push`-based length check breaks as soon as a later item finishes first.
- **Empty input:** with nothing to wait for, the counter never reaches 0 inside a callback. Resolve up front.
- **Why the first rejection wins:** calling `reject` (or `resolve`) on an already-settled promise is a no-op.
- **Complexity:** O(n) work and memory.
- **Follow-ups:** `Promise.allSettled`, `Promise.any`, `Promise.race`; accept any iterable (`Set`, generators) with `Array.from`; add a concurrency limit (`promiseAllLimit(tasks, k)` taking functions rather than already-started promises).
