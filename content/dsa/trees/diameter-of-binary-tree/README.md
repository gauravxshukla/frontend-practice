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

- **Key insight:** every path has one highest node where it bends. The longest path bending at node `x` has `height(x.left) + height(x.right)` edges.
- **Optimal:** one post-order DFS that returns each subtree's height and, along the way, updates a running `best` with `leftHeight + rightHeight`. O(n) time, O(h) stack.
- **Brute force:** for every node, compute both subtree heights from scratch. That's O(n²) on a skewed tree. Or compare every pair of nodes, which is worse.
- Pitfall: assuming the answer passes through the root. In `[1,2,null,3,4,5,null,null,6]` the longest path stays inside the left subtree.
- Pitfall: mixing up nodes and edges. With height counted in nodes (empty = 0), `left + right` is already the edge count.
- A single node has diameter 0.
- Follow-up: return the path itself, not just its length. Keep the bend node and rebuild each side by walking the taller child.
- Follow-up: the same idea gives Binary Tree Maximum Path Sum, with values instead of edge counts.
