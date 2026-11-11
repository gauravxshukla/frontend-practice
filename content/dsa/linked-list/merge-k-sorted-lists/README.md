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

- **Identify:** merge k sorted lists → reuse Merge Two Sorted Lists in balanced rounds (or a min-heap)
- **Brute force:** merge lists one after another into a growing result, O(N·k)
- **Better:** a min-heap of the k current heads, O(N log k), needs a heap structure
- **Insight:** merge lists in pairs each round; every node is touched once per round and there are log k rounds
- **Steps:** while more than one list remains, merge lists[0]+lists[1], lists[2]+lists[3]…; keep the results
- **Complexity:** O(N·k) → O(N log k) time, O(1) extra space besides the list of heads
- **Pitfall:** an empty input or lists that are all empty must return null
- **Related:** Merge Two Sorted Lists, Kth Largest Element in an Array, Find Median from Data Stream
