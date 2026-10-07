---
title: Copy List with Random Pointer
type: dsa
difficulty: medium
topic: linked-list
order: 6
neetcode: true
tags: [linked-list, hash-map, deep-copy]
estimatedMinutes: 20
---

Each node of this linked list has an extra pointer, `random`, that can point to **any** node in the list or be `null`. Build a **deep copy**: a brand-new list with the same values where every copied `next` and `random` points to the corresponding *copied* node. No pointer in the copy may refer to a node from the original list. Return the head of the copy.

Random-list nodes are plain objects: `{ val, next, random }`.

In the examples a list is written as `[[val, randomIndex], ...]`, where `randomIndex` is the 0-based position of the node that `random` points to, or `null`.

```js
function copyRandomList(head) // → head of the copy
```

## Examples

```text
Input:  head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]

Input:  head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
Explanation: both random pointers point at the second node, including the second node's own.
```

The output looks identical to the input because it's a faithful copy. The judge also rejects any answer that reuses an original node.

## Constraints

- 0 ≤ number of nodes ≤ 1000
- −10⁴ ≤ `node.val` ≤ 10⁴
- `random` is `null` or points to a node in the same list.

## Notes

- **Key insight:** the hard part is that `random` can point *forward* to a node you haven't copied yet. Decouple creation from wiring.
- Two passes with a `Map<original, copy>`: first create every copy, then set `copy.next = map.get(node.next)` and `copy.random = map.get(node.random)`.
- O(n) time, O(n) extra space for the map.
- O(1) extra space trick: interleave copies into the original list (`A → A' → B → B'`), set `A'.random = A.random.next`, then unweave the two lists. Mention it as the follow-up.
- Pitfall: setting `copy.random = node.random` copies the *original* pointer, so the "copy" still points into the old list.
- Pitfall: the interleaving trick must restore the original list's `next` pointers when unweaving.
- Edge cases: empty list, a node whose `random` points to itself, all `random` null, duplicate values (so you can't key the map by value).
