---
title: localStorage with Expiry
type: js
difficulty: medium
topic: classes-design
order: 2
tags: [classes, storage, dependency-injection, json]
estimatedMinutes: 20
---

Implement `class ExpiringStorage` (the default export), a wrapper around a `localStorage`-like object that lets entries expire.

```js
new ExpiringStorage(storage, now);
```

- `storage` is any object with `getItem(key)`, `setItem(key, string)` and `removeItem(key)`, where `getItem` returns `null` for a missing key. It defaults to a fresh **in-memory** store, so instances without one don't share data.
- `now` is a function returning the current time in ms. It defaults to `Date.now`. Injecting it lets tests move time forward without waiting.
- `setItem(key, value, ttlMs?)` stores `JSON.stringify({ value, expiresAt })` under `key`, where `expiresAt` is `now() + ttlMs`. Without a `ttlMs` (`undefined` or `null`), `expiresAt` is `null` and the entry never expires. Setting a key again replaces its value and expiry.
- `getItem(key)` returns the stored value (parsed back from JSON), or `null` if the key is missing. An entry is expired once `now() >= expiresAt`. An expired entry returns `null` **and is removed** from the underlying storage.
- `removeItem(key)` deletes the entry.

```js
let time = 1000;
const store = new ExpiringStorage(localStorage, () => time);

store.setItem('token', { id: 7 }, 500);
store.getItem('token'); // { id: 7 }
time = 1500;
store.getItem('token'); // null, and 'token' is removed from localStorage
```

**Constraints:** values are anything JSON can represent (objects, arrays, numbers, strings, booleans, `null`), and come back as equal copies. `getItem` doesn't throw on a raw value that wasn't written by `ExpiringStorage` (e.g. invalid JSON); it returns `null`. A `ttlMs` of `0` or less expires immediately.

## Notes

- **Approach:** wrap the value in an envelope `{ value, expiresAt }` and serialise the envelope. On read, parse it, compare `expiresAt` with `now()`, and remove the key lazily if it has expired.
- **Absolute, not relative, expiry:** store `now() + ttl`, not the ttl. A ttl alone can't tell you when the item was written.
- **Lazy eviction:** expired keys are only removed when read. To bound storage use, add a `prune()` that scans every key (`storage.length` + `storage.key(i)`), or prune on a timer.
- **`null` sentinel:** `expiresAt: null` survives JSON (unlike `Infinity`, which serialises to `null` anyway, or `undefined`, which disappears).
- **Defensive parsing:** wrap `JSON.parse` in `try/catch`. Other code, or an older version of your app, may have written to the same key.
- **Dependency injection:** passing `storage` and `now` makes the class testable without a browser or real time, and lets you swap in `sessionStorage`.
- **Complexity:** O(size of value) per operation, for serialisation.
- **Follow-ups:**
  - **Quota:** `setItem` can throw `QuotaExceededError`; evict expired keys and retry.
  - **Cross-tab sync:** the `storage` event.
  - **Sliding expiry:** extend `expiresAt` on each read.
  - **Clock skew:** the user changing their system clock.
