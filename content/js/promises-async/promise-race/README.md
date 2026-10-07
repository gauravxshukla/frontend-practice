---
title: Promise.race
type: js
difficulty: easy
topic: promises-async
order: 4
tags: [promises, async, polyfill]
estimatedMinutes: 10
---

Implement `promiseRace(iterable)`, which behaves like `Promise.race()`. Export it as `export default function promiseRace(iterable)`. Don't use the native `Promise.race`.

- The returned promise settles the same way as the **first input to settle** (by time, not by position): it fulfils with that value, or rejects with that reason.
- Later settlements are ignored.
- Plain values (non-promises) count as already-fulfilled promises, so they beat anything that settles on a timer.
- An **empty** input returns a promise that stays **pending forever**.

```js
await promiseRace([delay('slow', 40), delay('fast', 5)]); // 'fast'
await promiseRace([delay('slow', 40), fail('boom', 5)]); // rejects with 'boom'
```

**Constraints:** the input is an array. Always return a `Promise`. Don't wait for the slower inputs before settling.

## Notes

- **Approach:** inside `new Promise((resolve, reject) => ...)`, run `Promise.resolve(item).then(resolve, reject)` for every item. Settling a promise more than once is a no-op, so the first one wins automatically.
- **Why `Promise.resolve(item)`:** it normalises plain values and thenables, so you don't need a `typeof item.then` check.
- **Empty input:** the loop does nothing, so the promise never settles. That matches the spec; resist the urge to resolve `undefined`.
- **Complexity:** O(n) to subscribe; settles as soon as the first input does.
- **Pitfalls:** checking `instanceof Promise` and calling `resolve(item)` synchronously for non-promises in a way that skips earlier inputs; trying to "cancel" the losers (promises can't be cancelled; use `AbortController` for the underlying work).
- **Follow-ups:** a `withTimeout(promise, ms)` helper built on race, and how `race` differs from `any` (first settle vs first success).
