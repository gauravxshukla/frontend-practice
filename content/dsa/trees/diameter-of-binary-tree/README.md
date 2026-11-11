---
title: Diameter of Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 3
neetcode: true
tags: [trees, recursion, dfs]
estimatedMinutes: 15
---

You get the `root` of a binary tree. Return its **diameter**: the number of **edges** on the longest path between any two nodes. The path can bend at any node, and it doesn't have to pass through the root.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function diameterOfBinaryTree(root) // → number
```

## Examples

```text
Input:  root = [1,2,3,4,5]
Output: 3
Explanation: the path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3) has 3 edges.

Input:  root = [1,2]
Output: 1
```

## Constraints

- 1 ≤ number of nodes ≤ 10⁴
- −100 ≤ `node.val` ≤ 100

## Notes

- **Identify:** longest path between any two nodes → at each node, left height + right height
- **Brute force:** for each node, compute both subtree heights separately, O(n²)
- **Insight:** one DFS returns each subtree's height and updates the best left + right sum on the way up
- **Steps:** height(null) = 0; at each node best = max(best, hl + hr); return 1 + max(hl, hr)
- **Complexity:** O(n²) → O(n) time, O(h) space
- **Pitfall:** the longest path need not pass through the root; diameter counts edges, not nodes
- **Related:** Maximum Depth of Binary Tree, Balanced Binary Tree, Binary Tree Maximum Path Sum
