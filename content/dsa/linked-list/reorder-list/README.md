---
title: Reorder List
type: dsa
difficulty: medium
topic: linked-list
order: 4
neetcode: true
tags: [linked-list, two-pointers, fast-slow-pointers]
estimatedMinutes: 25
---

You get the `head` of a singly linked list `L0 → L1 → … → Ln−1 → Ln`. Rearrange it **in place** so the nodes alternate from the front and the back:

```
L0 → Ln → L1 → Ln−1 → L2 → Ln−2 → …
```

Move the nodes themselves; don't just rewrite their values. The function returns nothing, and the judge reads the list starting from the original `head`.

Nodes are plain objects: `{ val, next }`, and the last node's `next` is `null`.

```js
function reorderList(head) // → void (mutates the list)
```

## Examples

```text
Input:  head = [1,2,3,4]
Output: [1,4,2,3]

Input:  head = [1,2,3,4,5]
Output: [1,5,2,4,3]
```

## Constraints

- 1 ≤ number of nodes ≤ 5 · 10⁴
- 1 ≤ `node.val` ≤ 1000

## Notes

- **Identify:** interleave first and last nodes (L0, Ln, L1, Ln−1…) in place → middle + reverse + merge
- **Brute force:** copy nodes into an array and relink them with two indices, O(n) extra space
- **Insight:** the back half, reversed, is exactly the order to weave in, so no array is needed
- **Steps:** find the middle with slow/fast; cut and reverse the second half; alternate nodes from both halves
- **Complexity:** O(n) → O(n) time, O(n) → O(1) space
- **Pitfall:** cut the list at the middle (slow.next = null), or the weave creates a cycle
- **Related:** Reverse Linked List, Linked List Cycle, Merge Two Sorted Lists
