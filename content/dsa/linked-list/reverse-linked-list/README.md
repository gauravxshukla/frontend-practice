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

- Three pointers: `prev = null`, `curr = head`. Loop: `next = curr.next; curr.next = prev; prev = curr; curr = next`. Return `prev`.
- O(n) time, O(1) space.
- Recursive version: `const newHead = reverse(head.next); head.next.next = head; head.next = null; return newHead`. Its O(n) stack is worth mentioning.
