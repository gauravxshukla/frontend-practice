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

- **Recursive DFS:** swap `left` and `right`, then invert both subtrees. Return the node. O(n) time, O(h) stack (h = height, which is O(n) for a skewed tree).
- **Iterative BFS:** a queue of nodes, swap the children of each one you dequeue. This avoids deep recursion on skewed trees.
- Pitfall: `root.left = invertTree(root.right); root.right = invertTree(root.left)` reads `root.left` *after* overwriting it. Swap first, or capture both results in variables.
- Follow-up: check whether a tree is symmetric (a mirror of itself) without building the inverted copy.
