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

- **Identify:** numbers stored as reversed digit lists → add digit by digit with a carry, like on paper
- **Brute force:** convert both lists to integers, add, convert back; overflows for long lists
- **Insight:** least significant digit comes first, so add as you walk and carry into the next node
- **Steps:** while either list or a carry remains: sum the digits + carry, append sum % 10, carry = sum / 10
- **Complexity:** O(m + n) time either way, but only the digit-wise version avoids overflow; O(1) extra space
- **Pitfall:** a final carry needs one more node (5 + 5 = 0 → 1)
- **Related:** Merge Two Sorted Lists, Multiply Strings, Plus One
