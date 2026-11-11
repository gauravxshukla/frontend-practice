---
title: Remove Nth Node From End of List
type: dsa
difficulty: medium
topic: linked-list
order: 5
neetcode: true
tags: [linked-list, two-pointers]
estimatedMinutes: 15
---

Given the `head` of a linked list and an integer `n`, remove the `n`-th node **counting from the end** (`n = 1` is the last node) and return the head of the updated list. `n` is always valid.

Nodes are plain objects: `{ val, next }`.

```js
function removeNthFromEnd(head, n) // → head
```

## Examples

```text
Input:  head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Input:  head = [1], n = 1
Output: []

Input:  head = [1,2], n = 1
Output: [1]
```

## Constraints

- 1 ≤ number of nodes ≤ 30
- 0 ≤ `node.val` ≤ 100
- 1 ≤ `n` ≤ number of nodes

## Notes

- **Identify:** nth node from the end in one pass → two pointers n apart
- **Brute force:** count the length, then walk to node length − n, two passes
- **Insight:** start a lead pointer n steps ahead; when it reaches the end, the trailer sits before the target
- **Steps:** dummy → head; move lead n + 1 steps; move both until lead is null; skip trailer.next
- **Complexity:** two passes → one pass, O(n) time, O(1) space
- **Pitfall:** removing the head itself (n = length) needs the dummy node
- **Related:** Linked List Cycle, Reorder List, Reverse Linked List
