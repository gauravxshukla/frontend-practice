---
title: Feature Flags Client
type: js
difficulty: medium
topic: classes-design
order: 5
tags: [promises, caching, deduplication, design]
estimatedMinutes: 25
---

Implement `createFeatureFlags(fetchFlags)` (the default export). `fetchFlags()` returns a Promise of an object like `{ newCheckout: true, darkMode: false }`. Return a client:

```js
{
  isEnabled(name, fallback = false): Promise<boolean>,
  refresh(): Promise<object>,
}
```

- **Fetch once, then cache:** the first `isEnabled` call fetches the flags. Later calls use the cached flags without fetching again.
- **Deduplicate:** calls made while a fetch is in flight wait for that same fetch. Ten concurrent first calls mean **one** `fetchFlags()` call.
- `isEnabled(name, fallback)` resolves to the flag's value if `name` is an own key of the flags, even when the value is `false`, and to `fallback` if the flag is missing.
- **Failure:** if the fetch rejects (or `fetchFlags` throws), `isEnabled` resolves to `fallback`. It never rejects. Nothing is cached, so the **next** call fetches again.
- `refresh()` always starts a new fetch, and resolves with the new flags once they are cached. Calls to `isEnabled` made during a refresh wait for it. If the refresh fails, `refresh()` rejects and the previously cached flags stay in use.

```js
const flags = createFeatureFlags(() => fetch('/flags').then((r) => r.json()));

await Promise.all([flags.isEnabled('newCheckout'), flags.isEnabled('darkMode')]);
// → [true, false], with a single request
await flags.isEnabled('missing', true); // true (fallback)
await flags.refresh(); // refetches
```

**Constraints:** don't call `fetchFlags` until the first `isEnabled` or `refresh`. Clients are independent.

## Notes

- **Approach:** two closure variables: `cache` (the last successful flags) and `pending` (the in-flight promise). `isEnabled` awaits `pending` if there is one, otherwise uses `cache`, otherwise starts a fetch.
- **Deduplication:** store the **promise**, not the result. Assign it synchronously before any `await`, so a second call in the same tick sees it.
- **Retry after failure:** clear `pending` in the rejection handler. If you cached the rejected promise, every later call would fail forever.
- **Wrap the call:** `Promise.resolve().then(() => fetchFlags())` turns a synchronous throw into a rejection.
- **Overlapping refreshes:** only let a fetch write the cache if it is still the latest one (`pending === request`); otherwise a slow old response could overwrite a newer one.
- **Fallback on failure, but prefer stale data:** if a refresh fails and a cache exists, use the cache.
- **Follow-ups:**
  - **Stale-while-revalidate / TTL:** refetch in the background after N minutes.
  - **Subscriptions:** `onChange(name, cb)` for live updates (SSE/WebSocket).
  - **Bootstrapping:** start from server-rendered flags to avoid a flash of the wrong UI.
  - **Targeting:** user context sent to the flag service; percentage rollouts by hashing the user id.
