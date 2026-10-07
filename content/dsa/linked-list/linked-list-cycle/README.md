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

- Floyd's tortoise and hare: `slow` moves 1 step and `fast` moves 2. If they ever meet, there's a cycle. If `fast` reaches `null`, there isn't.
- The `Set` of visited nodes is O(n) space, which is fine to mention as the first idea.
- Follow-up: find the cycle's **start**. After they meet, reset one pointer to `head` and move both 1 step at a time. They meet at the start.
