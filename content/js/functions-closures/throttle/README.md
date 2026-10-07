---
title: Throttle
type: js
difficulty: medium
topic: functions-closures
order: 10
tags: [timers, closures, this]
estimatedMinutes: 15
---

Implement `throttle(func, wait)`. Export it as `export default function throttle(func, wait)`. It returns a throttled function that calls `func` **immediately** on the first call, then ignores further calls until `wait` ms have passed. After that, the next call runs immediately again and opens a new window.

- Forward the arguments and `this` of each call that actually runs.
- Ignored calls are **dropped**: they never run later (no trailing call), and they **don't extend** the window. The window always ends `wait` ms after the call that opened it.
- Each throttled function has its own window; two throttled wrappers never affect each other.

```js
const log = throttle((x) => console.log(x), 30);
log('a'); // logs 'a' immediately
log('b'); // ignored (inside the 30ms window)
// ...45ms later
log('c'); // logs 'c'
```

**Constraints:** `wait` is a non-negative number of milliseconds. No `cancel` method and no trailing-edge call are needed; the return value of the throttled function isn't checked.

## Notes

- **Approach:** one boolean flag in the closure. `if (throttled) return; throttled = true; setTimeout(() => (throttled = false), wait); func.apply(this, args);`
- **Bug in the original version:** it scheduled a new `setTimeout` on **every** call, including the ignored ones, so many timers piled up. Start exactly one timer when you open the window.
- **Alternative:** store `lastCall = Date.now()` and run when `Date.now() - lastCall >= wait`. No timer at all, but harder to extend with a trailing call.
- **`this`:** return a regular `function` so method usage (`obj.onScroll = throttle(...)`) works.
- **Complexity:** O(1) per call, at most one pending timer.
- **Pitfalls:** resetting the timer on ignored calls (that's debounce behaviour), and sharing the flag between wrappers.
- **Follow-ups:** a trailing call (run the last ignored call when the window ends), `leading: false`, a `cancel()` method, `requestAnimationFrame`-based throttling for scroll handlers, and explaining throttle vs debounce with a real UI example.
