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

- **Key insight:** you want the last node of each level in BFS order, and that node isn't always a right child.
- **BFS:** process level by level and record the last node of each level. O(n) time, O(w) space.
- **DFS:** visit right before left with a `depth` argument. The first node you reach at each new depth is the visible one. O(n) time, O(h) stack.
- Pitfall: following only `.right` pointers. In `[1,2,3,4]`, the deepest visible node is 4, which is a left descendant.
- Pitfall: in the DFS version, recording a value at every visit instead of only the first time a depth is reached (or else visiting left first and overwriting).
- An empty tree returns `[]`.
- Follow-up: the left side view, or the "top view" and "bottom view" by horizontal distance.
