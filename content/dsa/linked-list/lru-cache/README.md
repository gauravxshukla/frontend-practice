---
title: LRU Cache
type: dsa
difficulty: medium
topic: linked-list
order: 9
neetcode: true
tags: [design, hash-map, doubly-linked-list]
estimatedMinutes: 30
---

Design an `LRUCache` class: a fixed-size key-value cache that evicts the **least recently used** entry when it runs out of room.

- `new LRUCache(capacity)` creates a cache that holds at most `capacity` entries.
- `get(key)` returns the value stored for `key`, or `-1` if it isn't cached. A successful `get` counts as a use.
- `put(key, value)` inserts or updates `key`. That counts as a use too. If inserting a **new** key would exceed `capacity`, first evict the entry that was used least recently.

Both `get` and `put` must run in O(1) average time.

```js
class LRUCache {
  get(key)        // → number
  put(key, value) // → void
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for `put`).

```text
Input:
  operations = ["LRUCache","put","put","get","put","get","put","get","get","get"]
  arguments  = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]
Explanation: get(1) makes key 2 the least recent, so put(3) evicts 2.
             Then put(4) evicts 1.

Input:
  operations = ["LRUCache","put","put","put","get","get"]
  arguments  = [[1],[1,10],[1,20],[2,30],[1],[2]]
Output: [null,null,null,null,-1,30]
Explanation: put(1, 20) only updates key 1. With capacity 1, put(2) then evicts key 1.
```

## Constraints

- 1 ≤ `capacity` ≤ 3000
- 0 ≤ `key` ≤ 10⁴, 0 ≤ `value` ≤ 10⁵
- At most 2 · 10⁵ calls to `get` and `put`.

## Notes

- **Key insight:** you need O(1) lookup (hash map) **and** O(1) "move to most recent" / "remove least recent" (doubly linked list). Combine them: the map stores key → list node.
- Keep the list ordered from least recent (front) to most recent (back), with sentinel `head`/`tail` nodes so unlink and append never need null checks.
- `get`: look up the node, unlink it, append it at the back, and return its value.
- `put`: if the key exists, update the value and move it to the back. Otherwise, if full, remove `head.next` (from the list *and* the map), then append the new node.
- O(1) per operation, O(capacity) space.
- JS shortcut: a `Map` iterates in insertion order, so `delete` + `set` moves a key to the end and `map.keys().next().value` is the LRU key. It's fine to mention, but interviewers usually want the linked-list version.
- Pitfall: storing the key in the node is required, otherwise you can't delete the evicted entry from the map.
- Pitfall: updating an existing key must not trigger an eviction.
- Follow-up: LFU cache, or making it thread-safe.
