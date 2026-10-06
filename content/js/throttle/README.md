---
title: Throttle
type: js
difficulty: medium
tags: [timers, closures, this]
estimatedMinutes: 15
---

Implement `throttle(func, wait)`. It returns a throttled function that calls `func` **immediately** on the first call, then ignores further calls until `wait` ms have passed. After that, the next call runs immediately again.

- Forward arguments and `this`.

```js
const onScroll = throttle(() => console.log('scroll'), 100);
// Called on every scroll event, logs at most once per 100ms.
```

## Notes

- **Bug in the original version:** it scheduled a new `setTimeout` on **every** call, including the ignored ones, so many timers piled up. Start exactly one timer when you open the "closed" window.
- One boolean flag is enough: `if (throttled) return; throttled = true; setTimeout(() => (throttled = false), wait); func.apply(this, args);`
- Follow-ups: a trailing call (run the last ignored call when the window ends), and the difference between this and debounce.
