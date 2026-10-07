---
title: Cancellable Interval
type: js
difficulty: easy
topic: functions-closures
order: 11
tags: [timers, closures]
estimatedMinutes: 10
---

Implement `setCancellableInterval(fn, ms, ...args)`. It calls `fn(...args)` every `ms` milliseconds and returns a `cancel` function that stops it.

- The first call happens after `ms` (not immediately), like `setInterval`.
- After `cancel()` runs, `fn` is never called again.
- Calling `cancel` more than once is safe.

```js
const cancel = setCancellableInterval((name) => console.log('tick', name), 100, 'a');
// logs "tick a" at ~100ms, ~200ms, ~300ms...
cancel(); // no more ticks
cancel(); // no-op
```

**Constraints:** each call creates an independent interval; cancelling one doesn't affect others.

## Notes

- **Approach:** `const id = setInterval(fn, ms, ...args); return () => clearInterval(id);`. The closure keeps the id private, so callers can't clear the wrong timer.
- **Why return a function:** callers don't need to know about timer ids, which also differ between environments (a number in browsers, an object in Node).
- **Idempotency:** `clearInterval` on an already-cleared id is a no-op, so double cancel is safe without a flag.
- **Pitfall:** `setInterval` doesn't wait for `fn` to finish. For async work that may take longer than `ms`, use a recursive `setTimeout` instead.
- **Follow-ups:** a cancellable `setTimeout`, an `AbortSignal` instead of a cancel function, a version that also runs immediately, or `clear-all-timeouts`.
