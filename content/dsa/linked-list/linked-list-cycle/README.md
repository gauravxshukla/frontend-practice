---
title: Linked List Cycle
type: dsa
difficulty: easy
topic: linked-list
order: 3
neetcode: true
tags: [linked-list, two-pointers]
estimatedMinutes: 10
---

Given the `head` of a linked list (`{ val, next }` nodes), return `true` if the list contains a cycle, meaning some node's `next` points back to an earlier node.

Aim for O(1) extra space.

## Notes

- **Identify:** does following next ever loop back → fast and slow pointers (Floyd)
- **Brute force:** store every visited node in a set; a repeat means a cycle, O(n) space
- **Insight:** instead of remembering nodes, run one pointer twice as fast; in a loop it must catch the slow one
- **Steps:** slow moves 1, fast moves 2; if they meet → cycle; if fast reaches the end → no cycle
- **Complexity:** O(n) → O(n) time, O(n) → O(1) space
- **Pitfall:** check fast and fast.next before stepping twice, or the end of the list crashes
- **Related:** Find the Duplicate Number, Reorder List, Remove Nth Node From End of List
