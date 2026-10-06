---
title: Merge Two Sorted Lists
type: dsa
difficulty: easy
tags: [linked-list, pointers, blind75]
estimatedMinutes: 15
---

Given the heads of two **sorted** linked lists (`{ val, next }` nodes), splice their nodes together into one sorted list and return its head.

```
1 → 2 → 4   +   1 → 3 → 4   =   1 → 1 → 2 → 3 → 4 → 4
```

## Notes

- A dummy head node removes the "which list starts the result?" special case.
- Walk both lists and attach the smaller node. When one list runs out, attach the remainder of the other in one step.
- O(n + m) time, O(1) extra space (nodes are reused, not copied).
