---
title: Merge Two Sorted Lists
type: dsa
difficulty: easy
topic: linked-list
order: 2
neetcode: true
tags: [linked-list, pointers]
estimatedMinutes: 15
---

Given the heads of two **sorted** linked lists (`{ val, next }` nodes), splice their nodes together into one sorted list and return its head.

```
1 → 2 → 4   +   1 → 3 → 4   =   1 → 1 → 2 → 3 → 4 → 4
```

## Notes

- **Identify:** merge two sorted lists into one sorted list → two pointers + dummy head
- **Brute force:** collect all values, sort them, build a new list, O((m + n) log(m + n))
- **Insight:** the smaller of the two current heads is always next, so splice nodes directly
- **Steps:** dummy tail; attach the smaller head and advance that list; attach whatever list remains
- **Complexity:** O((m + n) log(m + n)) → O(m + n) time, O(1) extra space
- **Pitfall:** a dummy head avoids special-casing the first node and empty inputs
- **Related:** Merge k Sorted Lists, Add Two Numbers, Reverse Linked List
