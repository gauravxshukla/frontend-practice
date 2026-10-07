---
title: Binary Tree Maximum Path Sum
type: dsa
difficulty: hard
topic: trees
order: 14
neetcode: true
tags: [trees, dfs, recursion, dynamic-programming]
estimatedMinutes: 30
---

You get the `root` of a non-empty binary tree whose values can be negative. A **path** is any sequence of nodes connected by parent/child edges, where no node appears twice. It must contain at least one node, and it doesn't have to pass through the root. Return the largest possible **sum** of the values on a path.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function maxPathSum(root) // → number
```

## Examples

```text
Input:  root = [1,2,3]
Output: 6
Explanation: 2 → 1 → 3.

Input:  root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: 15 → 20 → 7. Including -10 would only lower the sum.
```

## Constraints

- 1 ≤ number of nodes ≤ 3 · 10⁴
- −1000 ≤ `node.val` ≤ 1000

## Notes

- **Key insight:** every path has a highest node where it can bend and use both children. But a path passed **up** to a parent can only continue down one side.
- **Optimal:** post-order DFS where `gain(node)` returns the best sum of a downward path starting at `node`. At each node, compute `left = max(0, gain(left))` and `right = max(0, gain(right))`, update `best` with `node.val + left + right`, and return `node.val + max(left, right)`. O(n) time, O(h) stack.
- Clamping a child's gain at 0 means "don't take that branch" when it would lower the sum.
- **Brute force:** for every pair of nodes, sum the path between them through their LCA. That's O(n²) pairs times O(h) per path.
- Pitfall: starting `best` at 0. If every value is negative, the answer is the largest single value, such as -1 in `[-2,-1]`.
- Pitfall: returning `node.val + left + right` to the parent. A path can't branch twice.
- Same structure as Diameter of Binary Tree, with values instead of edge counts.
- Follow-up: return the path's nodes as well, or limit paths to go downward only.
