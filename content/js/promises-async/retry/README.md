---
title: Retry
type: js
difficulty: medium
topic: promises-async
order: 9
tags: [promises, async, timers, resilience]
estimatedMinutes: 15
---

Implement `retry(fn, { retries, delay })`. `fn` takes no arguments and returns a promise. Keep calling it until it succeeds or you run out of attempts.

- Call `fn` up to **`retries + 1`** times in total: one first attempt plus `retries` retries. `retries: 0` means a single attempt.
- Resolve with the value of the **first** successful call, and stop calling `fn`.
- If every attempt fails, reject with the error from the **last** attempt.
- Wait `delay` ms **between** attempts: not before the first one, and not after the final failure.
- Both options are optional and default to `0`.

```js
let calls = 0;
const flaky = () => (++calls < 3 ? Promise.reject(new Error(`fail ${calls}`)) : Promise.resolve('ok'));

await retry(flaky, { retries: 3, delay: 10 }); // 'ok', after 3 calls
await retry(() => Promise.reject(new Error('down')), { retries: 2 }); // rejects with Error('down') after 3 calls
```

**Constraints:** return a `Promise`. Don't start the next attempt until the previous one has settled.

## Notes

- **Approach:** an `async` loop: `for (let attempt = 0; attempt <= retries; attempt++)`, `try { return await fn(); } catch (e) { lastError = e; }`, and `await sleep(delay)` before every attempt after the first. After the loop, `throw lastError`.
- **Pitfall:** `return fn()` instead of `return await fn()` inside `try` won't catch the rejection, so the first failure escapes.
- **Pitfall:** off-by-one. `retries` counts retries, not attempts.
- **Optional, exponential backoff:** wait `delay * 2 ** (attempt - 1)` instead of a fixed delay, capped at a maximum, and add random **jitter** so many clients don't retry in lockstep (the "thundering herd").
- **Complexity:** O(retries) calls; total wait about `retries × delay`.
- **Follow-ups:** a `shouldRetry(error)` predicate (don't retry a 4xx), an `onRetry` hook for logging, cancelling with an `AbortSignal`, or combining with a per-attempt timeout.
