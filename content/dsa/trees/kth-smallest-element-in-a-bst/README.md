---
title: Kth Smallest Element in a BST
type: dsa
difficulty: medium
topic: trees
order: 12
neetcode: true
tags: [trees, binary-search-tree, dfs, stack]
estimatedMinutes: 15
---

You get the `root` of a **binary search tree** and an integer `k`. Return the `k`-th smallest value in the tree, counting from 1.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function kthSmallest(root, k) // → number
```

## Examples

```text
Input:  root = [3,1,4,null,2], k = 1
Output: 1

Input:  root = [5,3,6,2,4,null,null,1], k = 3
Output: 3
Explanation: the sorted values are 1, 2, 3, 4, 5, 6.
```

## Constraints

- 1 ≤ `k` ≤ number of nodes ≤ 10⁴
- −10⁴ ≤ `node.val` ≤ 10⁴, all values unique

## Notes

- **Key insight:** an in-order traversal of a BST visits values in ascending order, so the k-th visited value is the answer.
- **Optimal:** iterative in-order with an explicit stack. Push left children, pop, decrement `k`, and stop when it hits 0. O(h + k) time, O(h) space.
- A recursive in-order with a counter also works. Be sure to stop early once the answer is found.
- **Brute force:** collect every value, sort, and index `k - 1`. O(n log n) time, O(n) space, and it ignores the BST property.
- Pitfall: off-by-one. `k` is 1-based.
- Pitfall: continuing the traversal after finding the answer, which wastes O(n) on big trees.
- Follow-up: if the tree changes often and you query often, store the subtree size in each node. Then each query is O(h): compare `k` with the left subtree's size to choose a direction.
