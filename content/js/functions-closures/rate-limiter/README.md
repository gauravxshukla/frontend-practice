---
title: Rate Limiter
type: js
difficulty: medium
topic: functions-closures
order: 13
tags: [closures, timers, sliding-window]
estimatedMinutes: 20
---

Implement `createRateLimiter(limit, windowMs)`. It returns a function `tryAcquire()` that returns `true` if a call is allowed right now, and `false` if it isn't.

Use a **sliding window log**: a call is allowed only if fewer than `limit` calls were allowed in the last `windowMs` milliseconds. As time passes, old calls drop out of the window and free their slots.

- Only **allowed** calls count; a rejected call (`false`) doesn't take a slot.
- Use real time (`Date.now()`).

```js
const tryAcquire = createRateLimiter(2, 1000);
tryAcquire(); // true  (t = 0)
tryAcquire(); // true  (t = 0)
tryAcquire(); // false (2 calls in the last second)
// ...at t = 1001ms, both earlier calls have expired:
tryAcquire(); // true
```

**Constraints:**

- A call made exactly `windowMs` ms after an earlier one is outside that one's window (the earlier call no longer counts).
- Every `createRateLimiter` call creates an **independent** limiter.
- Slots free up one at a time as each old call expires; this is a sliding window, not a fixed window that resets all at once.

## Notes

- **Approach:** keep an array of timestamps of allowed calls. On each call, drop timestamps `<= now - windowMs` from the front (they're in order), then allow and push `now` if `log.length < limit`.
- **Why sliding, not fixed:** a fixed window (reset the count every `windowMs`) allows bursts of `2 × limit` around a boundary. The log never allows more than `limit` in **any** `windowMs` span.
- **Memory:** the log holds at most `limit` entries, because rejected calls aren't recorded. Using a queue (or a ring buffer) makes eviction O(1); `shift()` is fine for small limits.
- **Pitfall:** recording rejected calls too. A client that keeps retrying would then lock itself out forever.
- **Complexity:** O(1) amortised per call, O(limit) memory.
- **Follow-ups:** a token bucket (smooth refill, allows short bursts), a sliding window counter (approximate, O(1) memory), per-key limits (a `Map` of logs per user/IP), or returning how long to wait before retrying.
