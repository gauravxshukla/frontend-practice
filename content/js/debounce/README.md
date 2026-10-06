---
title: Debounce
type: js
difficulty: medium
tags: [timers, closures, this]
estimatedMinutes: 15
---

Implement `debounce(func, wait)`. It returns a debounced function that delays calling `func` until `wait` ms have passed since the **last** call. Each new call restarts the timer.

- `func` is called with the arguments and `this` of the **latest** call.

```js
const log = debounce((q) => console.log('search', q), 300);
log('r'); log('re'); log('rea'); // 300ms later, logs once: 'search rea'
```

## Notes

- One closure variable for the timer id: `clearTimeout(timerId); timerId = setTimeout(...)`.
- Capture `this` from a regular `function` (an arrow function would capture the definition's `this`).
- Follow-ups: `cancel()`/`flush()` methods, `leading`/`trailing` options, and a `maxWait` (which turns into throttle).
