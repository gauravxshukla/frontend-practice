---
title: Cycle
type: js
difficulty: easy
topic: functions-closures
order: 3
tags: [closures, toggle]
estimatedMinutes: 10
---

Implement `cycle(...values)`. It returns a function that, on each call, returns the next value in `values`, going back to the first one after the last. With two values it behaves like a toggle.

```js
const toggle = cycle('on', 'off');
toggle(); // 'on'
toggle(); // 'off'
toggle(); // 'on'

const step = cycle(1, 2, 3);
step(); step(); step(); // 1, 2, 3
step(); // 1
```

**Constraints:**

- With a single value, every call returns that value.
- Values can be of any type, including `undefined`, `null` and objects (return the same reference).
- Every call to `cycle` creates an **independent** cycler with its own position.

## Notes

- **Approach:** keep an index in the closure. Return `values[index]`, then advance with `index = (index + 1) % values.length`.
- **Pitfall:** advancing before reading returns the second value first. Read, then advance.
- **Copying:** rest parameters already give you a fresh array, so later changes to the caller's array don't matter.
- **Complexity:** O(1) per call.
- **Follow-ups:** a `reset()` method, cycling backwards, or a generator version (`function* cycle(...values) { while (true) yield* values; }`). Ask what zero values should do (return `undefined`, or throw).
