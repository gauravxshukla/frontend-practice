---
title: Limit
type: js
difficulty: easy
topic: functions-closures
order: 6
tags: [closures, higher-order-functions]
estimatedMinutes: 10
---

Implement `limit(func, n)`. Export it as `export default function limit(func, n)`. It returns a wrapper that invokes `func` **at most `n` times**. Later calls skip `func` and return the result of the **last** invocation.

```js
let i = 0;
const incrementAtMostTwice = limit(() => ++i, 2);
incrementAtMostTwice(); // 1
incrementAtMostTwice(); // 2
incrementAtMostTwice(); // 2 (func not called)
```

- Forward each call's arguments and `this` to `func` while calls remain.
- With `n = 0`, `func` is never called and every call returns `undefined`.
- A result of `undefined` (or any falsy value) still counts as an invocation.
- If `func` throws, the error propagates and that call **still counts** toward `n`. The stored result stays whatever the last successful call returned.
- Each wrapper has its own counter, even when wrapping the same `func`.

**Constraints:** `n` is a non-negative integer.

## Notes

- **Approach:** closure state is a countdown (`remaining = n`) and `lastResult`. On each call, if `remaining > 0`, decrement **first**, then `lastResult = func.apply(this, args)`. Always return `lastResult`.
- **Why decrement first:** a throwing `func` then still uses up a call, and a re-entrant call from inside `func` can't sneak past the limit.
- **`this`:** return a regular `function` (not an arrow) so `this` is whatever the caller supplied.
- **Complexity:** O(1) per call.
- **Pitfalls:** checking `lastResult === undefined` to decide whether to call (breaks for functions that return `undefined`), and an off-by-one (`remaining >= 0`).
- **Follow-ups:** `once(func)` is `limit(func, 1)`; lodash's `_.before(n, func)` allows `n − 1` calls; `_.after(n, func)` is the mirror image (only start calling after n calls).
