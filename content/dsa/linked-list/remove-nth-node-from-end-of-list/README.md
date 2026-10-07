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

- **Key insight:** if one pointer starts `n + 1` steps ahead of another, then when the leader falls off the end, the follower sits right before the node to delete. One pass, no length count.
- Start both pointers at a **dummy** node whose `next` is `head`. Move `fast` forward `n + 1` times, then move both until `fast` is null, and finally `slow.next = slow.next.next`.
- Return `dummy.next`, not `head`, since the head itself may have been removed.
- O(n) time (one pass), O(1) space.
- Two-pass baseline: count the length `L`, then walk to node `L − n − 1`. Same complexity, but interviewers usually ask for the one-pass version.
- Pitfall: removing the head (`n === length`) without a dummy node needs a special case and is easy to forget.
- Edge cases: single node, removing the first node, removing the last node.
