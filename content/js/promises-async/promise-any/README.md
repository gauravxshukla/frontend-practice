---
title: Promise.any
type: js
difficulty: medium
topic: promises-async
order: 5
tags: [promises, async, polyfill]
estimatedMinutes: 20
---

Implement `promiseAny(iterable)`, which behaves like `Promise.any()`. Don't use the native `Promise.any`.

- Resolves with the value of the **first input to fulfil** (by time, not by position). Rejections are ignored while at least one input may still fulfil.
- If **every** input rejects, reject with an `AggregateError` whose `errors` array holds the rejection reasons **in input order**, not in the order they rejected.
- An **empty** input rejects with an `AggregateError` whose `errors` is `[]`.
- Inputs may be plain values (non-promises); treat them as already fulfilled.
- Accept any iterable (arrays, `Set`s, ...).

```js
await promiseAny([Promise.reject('a'), sleep(20).then(() => 'slow'), 'now']); // 'now'

try {
  await promiseAny([Promise.reject(1), Promise.reject(2)]);
} catch (e) {
  e instanceof AggregateError; // true
  e.errors; // [1, 2]
}
```

**Constraints:** always return a `Promise`. `AggregateError` is a global: `new AggregateError(errors, message)`.

## Notes

- **Approach:** mirror `Promise.all` with the roles swapped. Wrap each item in `Promise.resolve(item)`, resolve the outer promise on the first fulfilment, and store each rejection at its **index**. Keep a `remaining` counter; when it hits 0, reject with `new AggregateError(errors, 'All promises were rejected')`.
- **Pitfall:** pushing errors gives settle order. Write `errors[i] = reason` instead.
- **Pitfall:** an empty input would otherwise stay pending forever. Check for it up front.
- **Why settling more than once is safe:** extra `resolve`/`reject` calls on a settled promise are ignored, so later fulfilments are harmless.
- **Complexity:** O(n) work and memory.
- **Follow-ups:** compare `any` (first success), `race` (first settle), `all` (all succeed) and `allSettled` (never rejects). When would you use `any`? Fallback mirrors or CDNs.
