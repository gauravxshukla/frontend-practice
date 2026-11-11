---
title: Binary Tree Level Order Traversal
type: dsa
difficulty: medium
topic: trees
order: 8
neetcode: true
tags: [trees, bfs, queue]
estimatedMinutes: 15
---

You get the `root` of a binary tree. Return its values **level by level**: an array of arrays, where the first array is the root level, the next one holds the root's children, and so on. Within each level, list values from left to right. An empty tree gives `[]`.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function levelOrder(root) // → number[][]
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Input:  root = [1]
Output: [[1]]

Input:  root = []
Output: []
```

## Constraints

- 0 ≤ number of nodes ≤ 2000
- −1000 ≤ `node.val` ≤ 1000

## Notes

- **Identify:** values grouped level by level → BFS with a queue
- **Brute force:** DFS that passes the depth and appends to result[depth], also O(n) but less direct
- **Insight:** the queue's length at the start of a round is exactly the size of the current level
- **Steps:** queue = [root]; each round, pop "size" nodes into one list, pushing their children
- **Complexity:** O(n) time, O(n) space (the widest level)
- **Pitfall:** read the level size before the loop; the queue grows while you process it
- **Related:** Binary Tree Right Side View, Maximum Depth of Binary Tree, Rotting Oranges
