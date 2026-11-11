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

- **Identify:** k-th smallest in a BST → in-order traversal visits values in sorted order
- **Brute force:** collect every value, sort, take index k − 1, O(n log n)
- **Better:** full in-order list, then index k − 1, O(n) time and space
- **Insight:** count nodes during the in-order walk and stop as soon as the k-th one is visited
- **Steps:** in-order DFS (left, node, right); decrement k at each node; when k hits 0, record and stop
- **Complexity:** O(n log n) → O(h + k) time, O(h) space
- **Pitfall:** k is 1-indexed; stop recursing once found, or later nodes overwrite the answer
- **Related:** Validate Binary Search Tree, Lowest Common Ancestor of a Binary Search Tree, Kth Largest Element in an Array
