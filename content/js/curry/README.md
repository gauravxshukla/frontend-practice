---
title: Curry
type: js
difficulty: medium
tags: [closures, higher-order-functions, this]
estimatedMinutes: 15
---

Implement `curry(func)`. The curried function collects arguments across calls until it has **at least `func.length`** of them, then invokes `func` with all of them.

```js
const add = (a, b, c) => a + b + c;
const curried = curry(add);
curried(1)(2)(3);  // 6
curried(1, 2)(3);  // 6
curried(1)(2, 3);  // 6
curried(1, 2, 3);  // 6
```

Each partial application must be independent: `const p = curried(1); p(2)(3); p(10)(20)` should both work. Forward `this`.

## Notes

- `func.length` is the arity. Default and rest parameters aren't counted.
- Never mutate a shared args array. Each call returns a new closure over `[...args, ...nextArgs]`, which keeps partial applications independent.
- Follow-up: support placeholders (`curry.placeholder`, lodash-style), or infinite currying that's evaluated with an empty call `sum(1)(2)(3)()`.
