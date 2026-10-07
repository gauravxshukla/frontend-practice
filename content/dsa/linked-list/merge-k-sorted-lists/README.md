---
title: Merge k Sorted Lists
type: dsa
difficulty: hard
topic: linked-list
order: 10
neetcode: true
tags: [linked-list, heap, divide-and-conquer]
estimatedMinutes: 30
---

You get an array `lists` of `k` linked lists, each already sorted in ascending order. Merge them all into one sorted linked list and return its head. Some lists may be empty, and `lists` itself may be empty.

Nodes are plain objects: `{ val, next }`. In the examples each list is written as an array.

```js
function mergeKLists(lists) // → head
```

## Examples

```text
Input:  lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Input:  lists = []
Output: []

Input:  lists = [[]]
Output: []
```

## Constraints

- 0 ≤ k ≤ 10⁴
- 0 ≤ length of each list ≤ 500
- −10⁴ ≤ `node.val` ≤ 10⁴
- The total number of nodes N is at most 10⁴.

## Notes

- **Key insight:** merging two sorted lists is easy and linear. The question is how to combine k of them without re-scanning the long merged list over and over.
- **Divide and conquer:** merge lists in pairs (`0+1`, `2+3`, …), then merge the results in pairs, until one list remains. Each round touches every node once and there are `log k` rounds, so it's O(N log k) time and O(1) extra space (O(log k) if done recursively).
- **Min-heap:** push each list's head into a heap keyed by `val`. Pop the smallest, append it, and push its `next`. Also O(N log k) time, with O(k) heap space. In JS you have to write the heap yourself.
- Brute force: merge lists one at a time into an accumulator. The accumulator keeps growing, so it's O(N · k). Or collect all values and sort them, which is O(N log N) and allocates new nodes.
- Pitfall: an empty `lists` array or lists that are all `null`. Both must return `null`.
- Pitfall: when pairing, an odd list out must be carried to the next round, not dropped.
- Follow-up: how does this change for k sorted streams that don't fit in memory? (External merge with a heap.)
