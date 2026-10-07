---
title: Lowest Common Ancestor of a Binary Search Tree
type: dsa
difficulty: medium
topic: trees
order: 7
neetcode: true
tags: [trees, binary-search-tree, dfs]
estimatedMinutes: 15
---

You get the `root` of a **binary search tree** with unique values, and two nodes `p` and `q` that are both in the tree. Return their **lowest common ancestor**: the deepest node that has both `p` and `q` as descendants. A node counts as a descendant of itself, so if `p` is an ancestor of `q`, the answer is `p`.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child. In the examples, `p` and `q` are written as their values, but your function receives the actual node objects from the tree. Return the ancestor **node**. The tests compare its `val`.

```js
function lowestCommonAncestor(root, p, q) // → node
```

## Examples

```text
Input:  root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6

Input:  root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: 2 is an ancestor of 4, and a node is its own descendant.

Input:  root = [2,1], p = 2, q = 1
Output: 2
```

## Constraints

- 2 ≤ number of nodes ≤ 10⁵
- −10⁹ ≤ `node.val` ≤ 10⁹, all values unique
- `p` and `q` both exist in the tree (they may be the same node)

## Notes

- **Key insight:** in a BST, the LCA is the first node on the way down where `p` and `q` stop being on the same side.
- **Optimal:** start at the root. If both values are smaller, go left. If both are larger, go right. Otherwise this node splits them (or equals one of them), so return it. O(h) time, O(1) space iteratively.
- **Brute force (works for any binary tree):** record the root-to-node path for `p` and for `q`, then return the last node the two paths share. O(n) time and space.
- The general binary-tree LCA uses post-order DFS: return the node if it is `p` or `q`, and the node where both sides return non-null is the answer.
- Pitfall: using `<=`/`>=` in the "go left/right" tests, which walks past the split when one target equals the current node.
- Pitfall: comparing node objects with values. Use `p.val`, not `p`.
- With h = O(log n) for a balanced tree, this is very fast. A skewed BST degrades to O(n).
- Follow-up: LCA in a general binary tree, or when `p`/`q` might be missing.
