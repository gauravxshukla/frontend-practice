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

- **Identify:** latest value at or before a timestamp, timestamps only increase → per-key list + binary search
- **Brute force:** scan the key's whole history on every get, O(n) per get
- **Insight:** set calls arrive in time order, so each key's list is already sorted for binary search
- **Steps:** set appends (timestamp, value); get binary searches the rightmost timestamp ≤ t
- **Complexity:** get O(n) → O(log n); set O(1); O(n) space
- **Pitfall:** an unknown key, or a t before the first timestamp, returns ""
- **Related:** Binary Search, Search a 2D Matrix, LRU Cache
