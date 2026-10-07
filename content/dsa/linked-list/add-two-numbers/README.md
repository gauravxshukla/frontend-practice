---
title: Add Two Numbers
type: dsa
difficulty: medium
topic: linked-list
order: 7
neetcode: true
tags: [linked-list, math, simulation]
estimatedMinutes: 15
---

Two non-negative integers are stored as linked lists, one digit per node, with the **least significant digit first**. So `342` is stored as `2 → 4 → 3`. Add the two numbers and return the sum as a linked list in the same reversed-digit format.

Neither number has leading zeros, except the number `0` itself (a single node `0`).

Nodes are plain objects: `{ val, next }`.

```js
function addTwoNumbers(l1, l2) // → head
```

## Examples

```text
Input:  l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.

Input:  l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

## Constraints

- 1 ≤ nodes in each list ≤ 100
- 0 ≤ `node.val` ≤ 9

## Notes

- **Key insight:** the digits are already in the order you add them by hand (ones first), so walk both lists together and carry like grade-school addition.
- Each step: `sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry`, append `sum % 10`, set `carry = Math.floor(sum / 10)`.
- Loop while **either** list has nodes **or** `carry` is non-zero, and a dummy head keeps the append logic uniform.
- O(max(m, n)) time, O(max(m, n)) space for the output.
- Pitfall: forgetting the final carry (`[5] + [5]` must give `[0,1]`).
- Pitfall: converting to a JS number (or even `BigInt` without saying why) loses precision past 2⁵³. Lists of 100 digits overflow a double.
- Edge cases: lists of different lengths, `[0] + [0]`, carries that ripple through many nines.
- Follow-up: digits stored most-significant first (LeetCode 445). Use two stacks, or reverse both lists first.
