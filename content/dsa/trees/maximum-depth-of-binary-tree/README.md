---
title: Maximum Depth of Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 2
neetcode: true
tags: [trees, recursion, dfs, bfs]
estimatedMinutes: 10
---

You get the `root` of a binary tree. Return its **depth**: the number of nodes on the longest path from the root down to any leaf. An empty tree has depth 0, and a single node has depth 1.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function maxDepth(root) // → number
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: 3
Explanation: the longest root-to-leaf paths are 3 → 20 → 15 and 3 → 20 → 7.

Input:  root = [1,null,2]
Output: 2
```

## Constraints

- 0 ≤ number of nodes ≤ 10⁴
- −100 ≤ `node.val` ≤ 100

## Notes

- **Identify:** longest root-to-leaf path length → depth = 1 + deeper child (DFS)
- **Brute force:** list every root-to-leaf path and take the longest, O(n·h)
- **Insight:** a node's depth only needs its children's depths, so return them up the recursion
- **Steps:** null → 0; otherwise 1 + max(depth(left), depth(right))
- **Complexity:** O(n·h) → O(n) time, O(h) space
- **Pitfall:** an empty tree has depth 0, a single node has depth 1
- **Related:** Diameter of Binary Tree, Balanced Binary Tree, Invert Binary Tree
