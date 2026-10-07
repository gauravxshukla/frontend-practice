---
title: Infinite Currying Sum
type: js
difficulty: medium
topic: functions-closures
order: 7
tags: [closures, currying, recursion]
estimatedMinutes: 15
---

Implement `sum(...args)` so that calls can be chained any number of times, and a final call with **no arguments** returns the total of every number passed along the chain.

- Each call may pass one or more numbers.
- An empty call `()` ends the chain and returns the total.
- `sum()` on its own returns `0`.

```js
sum(1)(2)(3)(); // 6
sum(1, 2)(3)(); // 6
sum(5)(); // 5
sum(); // 0
```

**Constraints:** every intermediate function is **immutable**: calling it doesn't change it, so it can be reused to start different chains.

```js
const s = sum(1);
s(2)(); // 3
s(3)(); // 4 (not 6)
```

## Notes

- **Approach:** a closure over the running total. `sum(...args)` returns `0` when called with nothing; otherwise it returns a function `next(...more)` that returns the total when `more` is empty, and otherwise starts a **new** chain: `sum(total + add(more))`.
- **Why a new chain each time:** a shared mutable `total` (`total += x; return next`) makes reused intermediates leak into each other (`s(3)()` would give 6).
- **Pitfall:** treating `sum(0)` or a `0` total as "end of chain". Check `args.length`, not truthiness.
- **Complexity:** O(k) per call for k arguments; each step allocates one closure.
- **Variant:** a version without the terminating `()` that uses `valueOf`/`toString` (or `Symbol.toPrimitive`) so `+sum(1)(2)` is `3`. It's clever but surprising, so mention it rather than lead with it.
- **Follow-ups:** generalise to `curryInfinite(reducer, initial)`, or contrast with fixed-arity `curry`.
