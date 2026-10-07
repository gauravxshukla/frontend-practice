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

- **Key insight:** a node is good exactly when its value is at least the maximum on its root path, so carry that maximum down as you go.
- **Optimal:** DFS with `(node, maxSoFar)`. Count the node if `node.val >= maxSoFar`, then recurse with `max(maxSoFar, node.val)`. O(n) time, O(h) stack.
- An iterative stack or BFS of `[node, maxSoFar]` pairs works the same way and avoids recursion depth limits.
- **Brute force:** keep the whole path and scan it at each node. That's O(n · h).
- Pitfall: comparing only with the parent instead of with the maximum of the whole path.
- Pitfall: using `>` instead of `>=`. Equal values still count as good.
- Pitfall: starting `maxSoFar` at 0. Trees can hold negatives, so start at `-Infinity` (or the root's value).
- Follow-up: return the good nodes themselves, or count paths whose values strictly increase.
