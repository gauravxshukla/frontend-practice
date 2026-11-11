---
title: Count Good Nodes in Binary Tree
type: dsa
difficulty: medium
topic: trees
order: 10
neetcode: true
tags: [trees, dfs, recursion]
estimatedMinutes: 15
---

You get the `root` of a binary tree. A node is **good** if no node on the path from the root down to it (including the root) has a value **greater** than its own. Equal values are fine. Return how many good nodes the tree has. The root is always good.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function goodNodes(root) // → number
```

## Examples

```text
Input:  root = [3,1,4,3,null,1,5]
Output: 4
Explanation: the good nodes are 3 (root), 4, 5 and the 3 under 1.

Input:  root = [3,3,null,4,2]
Output: 3
Explanation: 2 is not good because 3 comes before it on its path.

Input:  root = [1]
Output: 1
```

## Constraints

- 1 ≤ number of nodes ≤ 10⁵
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Identify:** nodes with no larger value above them → DFS carrying the max on the path
- **Brute force:** for each node, walk its whole root path again to check, O(n·h)
- **Insight:** pass the path's maximum down the recursion so each node is checked in O(1)
- **Steps:** dfs(node, maxSoFar): count 1 if node.val ≥ maxSoFar; recurse with max(maxSoFar, node.val)
- **Complexity:** O(n·h) → O(n) time, O(h) space
- **Pitfall:** equal values count as good (≥, not >), and the root is always good
- **Related:** Validate Binary Search Tree, Binary Tree Maximum Path Sum, Maximum Depth of Binary Tree
