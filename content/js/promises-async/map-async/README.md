---
title: mapAsync
type: js
difficulty: medium
topic: promises-async
order: 10
tags: [promises, async]
estimatedMinutes: 15
---

Implement `mapAsync(iterable, callbackFn)`. Export it as `export default function mapAsync(iterable, callbackFn)`.

`callbackFn(value)` is an async transform that returns a promise. Call it once for every element, **all in parallel**, and resolve to the array of results **in input order**.

- Start every call **synchronously**, before any of them finishes. Don't wait for one call before starting the next.
- Resolve only once **every** call has finished, in input order, regardless of which finished first.
- If any call rejects (or throws synchronously), reject with that reason. If several reject, the **earliest** rejection wins.
- `callbackFn` may also return a plain value; treat it as already resolved.
- An empty input resolves to `[]` without calling `callbackFn`.

```js
const double = (n) => new Promise((r) => setTimeout(() => r(n * 2), 10));
await mapAsync([1, 2, 3], double); // [2, 4, 6]

await mapAsync([1, 2], (n) => (n === 2 ? Promise.reject('bad') : double(n))); // rejects with 'bad'
```

**Constraints:** the input is an array; don't mutate it. Always return a `Promise`.

## Notes

- **Approach:** a `results = new Array(n)` plus a `pending = n` counter. For each element, `await callbackFn(el)` inside an async callback (or `Promise.resolve().then(() => callbackFn(el))`), store at `results[index]`, decrement, and resolve at 0. Route any error to `reject`.
- **Bug in the original version:** it resolved when the *last index* finished (`index === len - 1`), not when *every* item finished. If item 2 resolved before item 0, you got a result with holes. Count completions instead.
- **Synchronous throws:** calling `callbackFn` inside a `try` (or inside an `async` function) turns a sync throw into a rejection instead of an exception that escapes `mapAsync`.
- **One-liner:** this is `Promise.all(iterable.map(callbackFn))`. Being able to say so is worth a mention.
- **Complexity:** O(n) work and memory; wall time is the slowest call, not the sum.
- **Follow-ups:** `mapAsyncLimit(iterable, callbackFn, size)` with at most `size` calls in flight, a `mapSeries` that runs one at a time, and passing `(value, index)` to the callback.
