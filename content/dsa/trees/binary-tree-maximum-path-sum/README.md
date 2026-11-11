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

- **Identify:** max sum of any node-to-node path → DFS returning the best downward "gain"
- **Key formula:** path through node = node.val + max(leftGain, 0) + max(rightGain, 0)
- **Brute force:** try every pair of nodes and sum the path between them, O(n²) or worse
- **Insight:** a path bends at exactly one node; return a one-sided gain up, record the two-sided sum at each node
- **Steps:** gain(node): l, r = max(gain(child), 0); best = max(best, val + l + r); return val + max(l, r)
- **Complexity:** O(n²) → O(n) time, O(h) space
- **Pitfall:** start best at −∞ (or the root value); all-negative trees must return the largest single node
- **Related:** Diameter of Binary Tree, Count Good Nodes in Binary Tree, Maximum Subarray
