---
title: Analytics SDK
type: js
difficulty: medium
topic: classes-design
order: 6
tags: [classes, batching, timers, promises, design]
estimatedMinutes: 30
---

Implement `class Analytics` (the default export), a client that buffers tracked events and sends them in batches.

```js
new Analytics({ send, batchSize = 5, flushInterval = 50 });
```

- `send(events)` is provided by the caller. It receives an array of events and returns a Promise; a rejection means the batch failed.
- `track(event, props = {})` appends `{ event, props }` to the buffer. Then:
  - if the buffer holds `batchSize` or more events, it flushes immediately;
  - otherwise, if no timer is pending, it starts one that flushes after `flushInterval` ms. (Further tracks don't restart that timer.)
- `flush()` cancels any pending timer and sends everything buffered, in batches of at most `batchSize` events, **one batch at a time, in order**. It returns a Promise that resolves to `true` if everything was sent, or `false` if a send failed. It never rejects.
  - With an empty buffer it doesn't call `send` and resolves to `true`.
  - **On failure** the failed batch, and anything after it, stays in the buffer **at the front**, in its original order, ahead of events tracked later. It is retried on the next flush (whether that's manual, timed or triggered by `batchSize`).
  - Flushes never overlap: a flush started while another is sending waits for it.
- `destroy()` cancels the pending timer. After `destroy()`, `track` is ignored and nothing is sent automatically; calling `flush()` still works.

```js
const analytics = new Analytics({ send: (events) => api.post('/events', events), batchSize: 2 });

analytics.track('view', { page: '/' });
analytics.track('click', { id: 'buy' }); // batchSize reached → send([view, click])
analytics.track('view', { page: '/cart' }); // sent ~50 ms later by the timer
```

**Constraints:** events are always sent in the order they were tracked, including across failures and retries. Instances don't share buffers or timers.

## Notes

- **Approach:** a `buffer` array, a `timer` id and a `queue` promise. `flush()` chains a `drain` step onto `queue` (`queue = queue.then(drain)`), which serialises flushes so a retry can never be overtaken by newer events. `drain` repeatedly `splice`s up to `batchSize` events off the front and awaits `send`.
- **Re-queue on failure:** `buffer.unshift(...batch)` puts the failed events back in front of anything tracked while the request was in flight.
- **Never reject from flush:** `track` and the timer call `flush()` without awaiting it, so a rejection would be an unhandled rejection. Report success as a boolean instead.
- **Timer semantics:** starting the timer on the first buffered event (not resetting on every event) bounds latency at `flushInterval`, like a throttle rather than a debounce.
- **Complexity:** O(1) amortised per `track`; each flush is O(n) for n buffered events.
- **Follow-ups:**
  - **Page unload:** flush with `navigator.sendBeacon` on `visibilitychange`/`pagehide`.
  - **Retry policy:** exponential backoff with jitter, a max retry count, and a cap on the buffer size (drop oldest).
  - **Persistence:** keep the buffer in IndexedDB so events survive reloads.
  - **Enrichment:** timestamps, session/user ids, sampling and consent.
