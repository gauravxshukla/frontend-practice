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

- **Key insight:** the result interleaves the first half with the *reversed* second half. Break it into three classic steps.
- Step 1: find the middle with slow/fast pointers (stop when `fast.next` or `fast.next.next` is null so `slow` ends at the end of the first half).
- Step 2: cut after `slow` (`slow.next = null`) and reverse the second half in place.
- Step 3: merge by alternating one node from each half until the second half runs out.
- O(n) time, O(1) extra space.
- Brute force: copy the nodes into an array, then relink them with two indices from both ends. O(n) time but O(n) space.
- Pitfall: forgetting to cut the first half, which leaves a cycle after the merge.
- Edge cases: one or two nodes (nothing changes), odd vs even length.
- Follow-up: do it recursively, or explain why the array version is acceptable when memory isn't tight.
