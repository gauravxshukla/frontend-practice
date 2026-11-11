---
title: Reverse Nodes in k-Group
type: dsa
difficulty: hard
topic: linked-list
order: 11
neetcode: true
tags: [linked-list, pointers, recursion]
estimatedMinutes: 30
---

Given the `head` of a linked list and a positive integer `k`, reverse the nodes **k at a time** and return the new head. If the number of nodes left at the end is less than `k`, leave those last nodes in their original order.

Move the nodes themselves; don't just swap values. Nodes are plain objects: `{ val, next }`.

```js
function reverseKGroup(head, k) // → head
```

## Examples

```text
Input:  head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
Explanation: 5 is left over on its own, so it stays put.

Input:  head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
```

## Constraints

- 1 ≤ `k` ≤ n ≤ 5000, where n is the number of nodes
- 0 ≤ `node.val` ≤ 1000

## Notes

- **Identify:** reverse every block of k nodes, leave a short tail alone → reverse sublists in place
- **Brute force:** copy values into an array, reverse each k-chunk, rebuild, O(n) extra space
- **Insight:** treat each k-block like Reverse Linked List, then reconnect it between the previous block and the next
- **Steps:** from groupPrev, check k nodes exist; reverse them; link groupPrev to the new front; advance groupPrev
- **Complexity:** O(n) → O(n) time, O(n) → O(1) space
- **Pitfall:** stop when fewer than k nodes remain; that tail stays in its original order
- **Related:** Reverse Linked List, Reorder List, Remove Nth Node From End of List
