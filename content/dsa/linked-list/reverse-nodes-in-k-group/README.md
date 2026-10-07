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

- **Key insight:** it's the plain "reverse a list" loop applied to one window at a time. The real work is reconnecting each reversed window to what comes before and after it.
- Keep `groupPrev` (the node before the window, starting at a dummy). Walk `k` steps to find `kth`. If you fall off the end, stop: the tail stays as is.
- Reverse the window with `prev` initialised to `kth.next`, so the old first node ends up pointing at the rest of the list.
- Then `groupPrev.next = kth`, and advance `groupPrev` to the old first node (now the window's tail).
- O(n) time, O(1) extra space.
- Baseline: copy values into an array, reverse each full chunk, and write them back. O(n) space, and it swaps values rather than nodes, which the problem forbids.
- Recursive version: reverse the first k nodes, then `oldFirst.next = reverseKGroup(rest, k)`. Cleaner, but O(n/k) stack.
- Edge cases: `k = 1` (no change), `k = n` (reverse everything), `n` an exact multiple of `k`, a single node.
- Follow-up: reverse the leftover partial group too, or reverse alternate groups only.
