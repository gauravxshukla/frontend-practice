---
title: mapAsyncLimit
type: js
difficulty: medium
topic: promises-async
order: 11
tags: [promises, async, concurrency]
estimatedMinutes: 25
---

Implement `mapAsyncLimit(items, limit, asyncFn)`. Like `mapAsync`, it calls `asyncFn(item, index)` for every element and resolves to the array of results, but **at most `limit` calls may be in flight** at any time.

- Resolve with the results **in input order**, regardless of which call finishes first.
- Never have more than `limit` calls running at once.
- Start the next item **as soon as any running call finishes** (a worker pool), not in fixed batches of `limit`.
- If any call rejects, reject with that reason straight away and start no further items.
- An empty `items` resolves to `[]`. A `limit` larger than `items.length` simply runs everything at once.
- Don't mutate `items`.

```js
const fetchUser = (id) => new Promise((r) => setTimeout(() => r({ id }), 10));

await mapAsyncLimit([1, 2, 3, 4, 5], 2, fetchUser);
// [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], with never more than 2 requests at once
```

**Constraints:** `limit` is a positive integer. Items start in input order.

## Notes

- **Approach (worker pool):** keep a shared `next` index. Start `min(limit, n)` "launches"; each takes `i = next++`, calls `asyncFn(items[i], i)`, stores `results[i]`, and on completion launches the next item. Resolve when the completed count reaches `n`.
- **Why not batches:** `for` chunks of `limit` with `Promise.all` each wait for the **slowest** item in the batch, leaving slots idle.
- **Alternative:** start `limit` async workers that each loop `while (next < n) { const i = next++; results[i] = await asyncFn(items[i], i); }`, then `await Promise.all(workers)`. JavaScript is single-threaded, so `next++` is race-free.
- **Pitfall:** `results.push` breaks ordering. Write by index.
- **Pitfall:** after a failure, stop launching new work (a `failed` flag).
- **Complexity:** O(n) calls; wall time is about the total work divided by `limit`.
- **Follow-ups:** an `allSettled` variant that collects errors, cancelling in-flight work on failure with `AbortController`, or a `p-limit`-style `limit(fn)` wrapper.
