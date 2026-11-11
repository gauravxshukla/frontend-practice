---
title: Validate Binary Search Tree
type: dsa
difficulty: medium
topic: trees
order: 11
neetcode: true
tags: [trees, binary-search-tree, dfs]
estimatedMinutes: 20
---

You get the `root` of a binary tree. Return `true` if it is a valid **binary search tree**: for every node, every value in its left subtree is strictly smaller, and every value in its right subtree is strictly larger. Duplicates are not allowed.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isValidBST(root) // → boolean
```

## Examples

```text
Input:  root = [2,1,3]
Output: true

Input:  root = [5,1,4,null,null,3,6]
Output: false
Explanation: 4 is in the right subtree of 5 but is smaller than 5.
```

## Constraints

- 1 ≤ number of nodes ≤ 10⁴
- −2³¹ ≤ `node.val` ≤ 2³¹ − 1

## Notes

- **Identify:** every node must sit inside the range its ancestors allow → DFS with (low, high) bounds
- **Brute force:** for each node, check it against every node in both subtrees, O(n²)
- **Better:** in-order traversal must be strictly increasing, O(n) with a list or a prev pointer
- **Insight:** instead of comparing with children only, pass down the open interval the node must fit in
- **Steps:** valid(node, low, high): low < val < high, then left gets (low, val) and right gets (val, high)
- **Complexity:** O(n²) → O(n) time, O(h) space
- **Pitfall:** checking only parent vs child misses a deep node violating an ancestor; duplicates are invalid
- **Related:** Kth Smallest Element in a BST, Lowest Common Ancestor of a Binary Search Tree, Count Good Nodes in Binary Tree
