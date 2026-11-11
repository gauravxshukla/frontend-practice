---
title: Binary Tree Right Side View
type: dsa
difficulty: medium
topic: trees
order: 9
neetcode: true
tags: [trees, bfs, dfs]
estimatedMinutes: 15
---

Imagine standing to the right of a binary tree and looking at it. On each level you see only the **rightmost** node. Given the `root`, return the values you can see, from the top level to the bottom one. An empty tree gives `[]`.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function rightSideView(root) // → number[]
```

## Examples

```text
Input:  root = [1,2,3,null,5,null,4]
Output: [1,3,4]

Input:  root = [1,null,3]
Output: [1,3]

Input:  root = []
Output: []
```

## Constraints

- 0 ≤ number of nodes ≤ 100
- −100 ≤ `node.val` ≤ 100

## Notes

- **Identify:** the node you'd see from the right on each level → BFS, take each level's last node
- **Brute force:** collect every level in full, then keep the last value of each, extra lists per level
- **Insight:** the rightmost node of a level is simply the last one processed in that BFS round
- **Steps:** level-order BFS; after building each level, record the value of its last node
- **Complexity:** O(n) time, O(w) space for the widest level
- **Pitfall:** a left node is visible when the right side is shorter, so don't just follow right pointers
- **Related:** Binary Tree Level Order Traversal, Maximum Depth of Binary Tree, Count Good Nodes in Binary Tree
