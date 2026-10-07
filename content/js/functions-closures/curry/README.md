---
title: Curry
type: js
difficulty: medium
topic: functions-closures
order: 8
tags: [closures, higher-order-functions, this]
estimatedMinutes: 15
---

Implement `curry(func)`. Export it as `export default function curry(func)`. The curried function collects arguments across calls until it has **at least `func.length`** of them, then invokes `func` with all of them and returns its result.

```js
const add = (a, b, c) => a + b + c;
const curried = curry(add);
curried(1)(2)(3); // 6
curried(1, 2)(3); // 6
curried(1)(2, 3); // 6
curried(1, 2, 3); // 6
```

- Arguments can be supplied in any grouping. Until there are enough, each call returns a new function and `func` is **not** called.
- The arity is `func.length` (default and rest parameters aren't counted). A zero-arity `func` runs on the first call.
- If a call supplies **more** arguments than needed, pass all of them through to `func`.
- A call with no arguments doesn't count toward the arity; it just returns a function that's still waiting.
- **Partial applications are independent:** `const p = curried(1); p(2)(3); p(10)(20)` both work, and the curried function itself can be reused.
- Forward `this` from the call that completes the arguments.

**Constraints:** `func` is a regular or arrow function with a fixed `length`. No placeholder support is needed.

## Notes

- **Approach:** `return function curried(...args) { if (args.length >= func.length) return func.apply(this, args); return function (...next) { return curried.apply(this, [...args, ...next]); }; }`
- **Independence:** never mutate a shared args array. Each call closes over a **new** array (`[...args, ...next]`), so branching from the same partial works.
- **`>=`, not `===`:** with `===`, a call that over-supplies arguments would keep returning functions forever.
- **`this`:** use regular functions and `apply(this, ...)` all the way down, so `obj.method = curry(fn)` sees `obj`.
- **Complexity:** O(k) per call to copy the k collected arguments; O(arity) total memory per chain.
- **Pitfalls:** relying on `arguments.length` of the outer call only, treating `curried()` as "done", and default parameters (`(a, b = 2) => ...` has `length` 1).
- **Follow-ups:** lodash-style placeholders (`curry.placeholder`), infinite currying evaluated with an empty call (`sum(1)(2)(3)()`), and `partial(fn, ...preset)` vs curry.
