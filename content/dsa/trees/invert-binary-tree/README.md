---
title: Invert Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 1
neetcode: true
tags: [trees, recursion, dfs, bfs]
estimatedMinutes: 10
---

You get the `root` of a binary tree. **Mirror** it: every node's left and right children swap places, all the way down. Return the root of the mirrored tree.

Nodes are plain objects: `{ val, left, right }`, and a missing child is `null`.

```js
function invertTree(root) // → root
```

## Examples

```
Input:  root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Input:  root = [2,1,3]
Output: [2,3,1]

Input:  root = []
Output: []
```

Trees are written in level order, and `null` marks a missing child.

## Constraints

- 0 ≤ number of nodes ≤ 100
- −100 ≤ `node.val` ≤ 100

## Notes

- **Identify:** mirror a tree → swap children at every node (DFS)
- **Brute force:** build a new mirrored tree node by node, O(n) extra space
- **Insight:** mirroring a tree = swap the two children, then mirror each child; do it in place
- **Steps:** if the node is null return null; invert both subtrees; swap left and right; return the node
- **Complexity:** O(n) → O(n) time, O(h) recursion space instead of a copy
- **Pitfall:** save one subtree before overwriting it, or both sides end up the same
- **Related:** Maximum Depth of Binary Tree, Same Tree, Subtree of Another Tree
