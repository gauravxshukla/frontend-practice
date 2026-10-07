---
title: Pipe
type: js
difficulty: easy
topic: functions-closures
order: 4
tags: [higher-order-functions, functional, this]
estimatedMinutes: 10
---

Implement `pipe(...fns)`. It returns a function that runs `fns` **left to right**: the first function receives the call's arguments, and each later function receives the previous function's result. The returned function gives back the last result.

- The first function may take any number of arguments; the rest take exactly one.
- With no functions, `pipe()` returns an identity function that gives back its first argument.
- `this` of the call is forwarded to the first function.

```js
const add = (a, b) => a + b;
const double = (x) => x * 2;
const toLabel = (x) => `Total: ${x}`;

const run = pipe(add, double, toLabel);
run(2, 3); // 'Total: 10'

pipe()(42); // 42
```

**Constraints:** don't call any function until the piped function is called. Calling it several times runs the whole chain each time.

## Notes

- **Approach:** call the first function with `fns[0].apply(this, args)`, then `reduce` over the rest: `fns.slice(1).reduce((acc, fn) => fn(acc), first)`.
- **compose:** `compose(f, g, h)(x)` is `f(g(h(x)))`, so it runs right to left. It's the same as `pipe` with the list reversed (`reduceRight`). Redux's `compose` and many FP libraries use this order; `pipe` reads in execution order.
- **`this`:** return a regular `function` so method usage (`obj.run = pipe(...)`) works.
- **Pitfall:** `reduce` with no initial value on an empty array throws. Handle "no functions" first.
- **Complexity:** O(n) per call for n functions.
- **Follow-ups:** an async `pipe` that awaits each step, or validating that every argument is a function.
