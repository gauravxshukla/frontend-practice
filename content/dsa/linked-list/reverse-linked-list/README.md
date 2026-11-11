---
title: Reverse Linked List
type: dsa
difficulty: easy
topic: linked-list
order: 1
neetcode: true
tags: [linked-list, pointers]
estimatedMinutes: 10
---

Given the `head` of a singly linked list, reverse it **in place** and return the new head.

Nodes are plain objects: `{ val, next }`, and the last node's `next` is `null`.

```
1 → 2 → 3 → null   becomes   3 → 2 → 1 → null
```

## Notes

- **Identify:** reverse a singly linked list in place → flip each next pointer while walking
- **Brute force:** copy values into an array and rebuild the list backwards, O(n) extra space
- **Insight:** instead of copying, re-point each node at the one before it, saving next first
- **Steps:** prev = null; for each node: save next, point node.next at prev, advance prev and node
- **Complexity:** O(n) → O(n) time, O(n) → O(1) space
- **Pitfall:** save node.next before overwriting it, or the rest of the list is lost
- **Related:** Reverse Nodes in k-Group, Reorder List, Merge Two Sorted Lists
