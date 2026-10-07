---
title: Debounce
type: js
difficulty: medium
topic: functions-closures
order: 9
tags: [timers, closures, this]
estimatedMinutes: 15
---

Implement `debounce(func, wait)`. Export it as `export default function debounce(func, wait)`. It returns a debounced function that delays calling `func` until `wait` ms have passed since the **last** call. Each new call restarts the timer.

- Never call `func` synchronously. A burst of calls produces **exactly one** call to `func`, `wait` ms after the last call in the burst.
- `func` receives the arguments and `this` of the **latest** call.
- Once a call has fired, the next call starts a new burst, which fires again after its own `wait`.
- Each debounced function has its own timer; two debounced wrappers never affect each other.

```js
const search = debounce((q) => console.log('search', q), 20);
search('r');
search('re');
search('rea'); // 20ms later, logs once: 'search rea'
```

**Constraints:** `wait` is a non-negative number of milliseconds. No `cancel`/`flush` methods and no leading-edge call are needed; the return value of the debounced function isn't checked.

## Notes

- **Approach:** one closure variable for the timer id. On every call: `clearTimeout(timerId); timerId = setTimeout(() => func.apply(context, args), wait)`.
- **`this`:** return a regular `function` and capture `this` (and `args`) on each call. An arrow function wrapper would capture the definition's `this`, not the caller's.
- **Latest arguments win:** because each call replaces the pending timer, the closure that eventually runs is the one from the last call.
- **Complexity:** O(1) per call, one pending timer at most.
- **Pitfalls:** storing the timer at module scope (shared between wrappers), only setting a timer when none is pending (that fires `wait` after the *first* call, which is closer to throttle), and calling `func` with the first call's arguments.
- **Follow-ups:** `cancel()` and `flush()` methods, `leading`/`trailing` options, a `maxWait` (which turns into throttle), and a promise-returning debounce for search-as-you-type.
