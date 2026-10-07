---
title: Time Based Key-Value Store
type: dsa
difficulty: medium
topic: binary-search
order: 6
neetcode: true
tags: [design, hash-map, binary-search]
estimatedMinutes: 20
---

Build a `TimeMap` class: a key-value store that remembers every version of a key, each tagged with a timestamp.

- `new TimeMap()` creates an empty store.
- `set(key, value, timestamp)` records `value` for `key` at time `timestamp`.
- `get(key, timestamp)` returns the value that was set for `key` at the **latest timestamp that is ≤ `timestamp`**. If there is no such version (the key was never set, or every version is newer), return the empty string `""`.

Timestamps passed to `set` are strictly increasing across all calls.

```js
class TimeMap {
  set(key, value, timestamp) // → void
  get(key, timestamp)        // → string
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for `set`).

```text
Input:
  operations = ["TimeMap","set","get","get","set","get","get"]
  arguments  = [[],["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]
Output: [null,null,"bar","bar",null,"bar2","bar2"]
Explanation: at time 3, the newest version of "foo" is still the one set at time 1.

Input:
  operations = ["TimeMap","set","get","get"]
  arguments  = [[],["love","high",10],["love",5],["miss",10]]
Output: [null,null,"",""]
Explanation: nothing for "love" existed at time 5, and "miss" was never set.
```

## Constraints

- 1 ≤ `key.length`, `value.length` ≤ 100
- 1 ≤ `timestamp` ≤ 10⁷
- Timestamps for `set` are strictly increasing.
- At most 2 · 10⁵ calls in total.

## Notes

- **Key insight:** because `set` timestamps only increase, appending to a per-key array keeps each array sorted for free. No sorting or balanced tree needed.
- Store `Map<key, [timestamp, value][]>`.
- `get` binary searches that array for the **last** timestamp `<= t` (an "upper bound minus one" search). Record the candidate whenever `entries[mid][0] <= t` and keep searching right.
- `set` is O(1), `get` is O(log k) where k is the number of versions of that key. Space is O(total sets).
- Brute force: scan the key's versions from the newest back, which makes `get` O(k).
- Pitfall: returning `undefined` or `null` instead of `""` for a missing key or a too-early timestamp.
- Pitfall: an off-by-one that returns the first timestamp *greater* than `t`.
- Follow-up: if timestamps could arrive out of order, use a sorted structure per key (or sort lazily before reads).
