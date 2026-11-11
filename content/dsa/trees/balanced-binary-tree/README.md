---
title: Balanced Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 4
neetcode: true
tags: [trees, recursion, dfs]
estimatedMinutes: 15
---

You get the `root` of a binary tree. Return `true` if it's **height-balanced**: at **every** node, the heights of the left and right subtrees differ by at most 1. An empty tree is balanced.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isBalanced(root) // → boolean
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: true

Input:  root = [1,2,2,3,3,null,null,4,4]
Output: false
Explanation: at the root, the left subtree has height 3 and the right subtree has height 1.

Input:  root = []
Output: true
```

## Constraints

- 0 ≤ number of nodes ≤ 5000
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Identify:** every node's subtree heights differ by at most 1 → bottom-up height DFS
- **Brute force:** at every node, compute both heights from scratch, O(n²)
- **Insight:** return the height up the recursion and use −1 to mean "already unbalanced"
- **Steps:** height(null) = 0; if a child is −1 or |hl − hr| > 1 return −1; else 1 + max
- **Complexity:** O(n²) → O(n) time, O(h) space
- **Pitfall:** checking only the root's two heights misses imbalance deeper down
- **Related:** Maximum Depth of Binary Tree, Diameter of Binary Tree, Same Tree
