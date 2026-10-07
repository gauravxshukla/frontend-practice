---
title: once
type: js
difficulty: easy
topic: functions-closures
order: 1
tags: [closures, higher-order-functions, this]
estimatedMinutes: 10
---

Implement `once(func)`. It returns a wrapper that calls `func` **only the first time** it is invoked. Every later call skips `func` and returns the result of that first call.

- Forward the first call's arguments and `this` to `func`.
- If the first call throws, rethrow the error. The wrapper then still counts as "used", so later calls return `undefined` and don't call `func` again.

```js
const init = once((name) => {
  console.log('initialising', name);
  return 42;
});

init('db'); // logs "initialising db", returns 42
init('cache'); // logs nothing, returns 42
```

**Constraints:** `func` may return any value, including `undefined`. Don't treat a falsy result as "not called yet".

## Notes

- **Approach:** keep two closure variables, `called` and `result`. On the first call, set `called = true` **before** invoking `func`, then store and return the result. Later calls return the stored result.
- **Why a flag rather than `result === undefined`:** a function that legitimately returns `undefined`, `0` or `''` would be called again.
- **`this`:** return a regular `function`, not an arrow function, and call `func.apply(this, args)` so method usage (`obj.init = once(fn)`) works.
- **Re-entrancy:** setting `called` first means a `func` that calls the wrapper recursively won't run twice.
- **Memory:** after the first call you can drop the reference (`func = undefined`) so the closure doesn't keep it alive.
- **Complexity:** O(1) per call.
- **Follow-ups:** lodash's `_.before(n, func)` (allow n − 1 calls), a `reset()` method, or a promise-aware `once` that shares one in-flight promise between concurrent callers.
