---
title: Make Counter
type: js
difficulty: easy
topic: functions-closures
order: 2
tags: [closures, factory]
estimatedMinutes: 10
---

Implement `makeCounter(initial = 0)`. It returns a counter object whose state lives in a closure:

- `get()` returns the current value.
- `increment()` adds 1 and returns the **new** value.
- `decrement()` subtracts 1 and returns the **new** value.
- `reset()` restores the initial value (and returns it).

```js
const counter = makeCounter(5);
counter.get(); // 5
counter.increment(); // 6
counter.increment(); // 7
counter.decrement(); // 6
counter.reset(); // 5
counter.get(); // 5
```

**Constraints:**

- `initial` defaults to `0` when omitted.
- Every call to `makeCounter` creates an **independent** counter.
- The count must not be reachable as a property (e.g. `counter.count`); only the methods can read or change it.

## Notes

- **Approach:** a `let value = initial` closure variable, and an object of four small functions that read or write it. The methods don't use `this`, so they still work when destructured (`const { increment } = makeCounter()`).
- **Encapsulation:** the closure is the private state. Exposing `count` as a property would let callers bypass the API.
- **Pitfall:** returning the old value from `increment` (post-increment `value++`). Use `++value` or `value += 1; return value`.
- **Complexity:** O(1) per call.
- **Follow-ups:** a simpler version that returns a function (`counter()` → 0, 1, 2…), a `step` option, bounds (`min`/`max`), or the same thing as a `class` with a `#private` field.
