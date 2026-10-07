---
title: pipeAsync
type: js
difficulty: medium
topic: promises-async
order: 14
tags: [promises, async, functional, composition]
estimatedMinutes: 10
---

Implement `pipeAsync(...fns)`. It returns a function `(input) => Promise` that passes `input` through `fns` **left to right**: the first function gets `input`, and each later one gets the previous result.

- Each function may be synchronous or return a promise. **Await** each result before calling the next function.
- The returned promise resolves with the final result.
- With no functions, it resolves to `input` unchanged.
- If a function rejects (or throws), the returned promise rejects with that error and the **remaining functions are not called**.
- The returned function always returns a `Promise`, even when every step is synchronous, and never throws synchronously.
- The pipeline can be called many times; each call is independent.

```js
const getUser = async (id) => ({ id, name: 'Ada' });
const getName = (user) => user.name;
const shout = async (s) => s.toUpperCase();

await pipeAsync(getUser, getName, shout)(1); // 'ADA'
await pipeAsync()(5); // 5
```

**Constraints:** every argument is a function that takes one argument.

## Notes

- **Approach:** `return async (input) => { let acc = input; for (const fn of fns) acc = await fn(acc); return acc; }`. The `async` wrapper turns sync throws into rejections, and `await` handles both sync values and promises.
- **One-liner:** `(input) => fns.reduce((p, fn) => p.then(fn), Promise.resolve(input))`. Once a step rejects, every later `then(fn)` is skipped.
- **Pitfall:** `fns.reduce((acc, fn) => fn(acc), input)` passes a *promise* to the next step instead of its value.
- **Complexity:** O(n) steps, one microtask hop each.
- **Follow-ups:** `composeAsync` (right to left), passing a shared context object, per-step timeouts, or a step that returns a `{ stop: true }` sentinel to short-circuit successfully.
