---
title: Limit
type: js
difficulty: easy
tags: [closures, higher-order-functions]
estimatedMinutes: 10
---

Implement `limit(func, n)`, which returns a function that invokes `func` at most `n` times. Later calls return the result of the **last** invocation without calling `func` again.

```js
let i = 0;
const incrementAtMostTwice = limit(() => ++i, 2);
incrementAtMostTwice(); // 1
incrementAtMostTwice(); // 2
incrementAtMostTwice(); // 2 (func not called)
```

The returned function should forward its arguments and `this` to `func`.

## Notes

- Closure state: a countdown plus the last result.
- Use a regular `function` (not an arrow) for the returned function, so `this` is whatever the caller supplied, and forward it with `func.apply(this, args)`.
- `once(func)` is just `limit(func, 1)`.
