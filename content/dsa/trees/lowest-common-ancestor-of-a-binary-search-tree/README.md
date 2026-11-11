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

- **Identify:** lowest common ancestor in a BST → BST ordering says which way both nodes lie
- **Brute force:** record the root-to-node path for p and q, then find their last shared node, O(n)
- **Insight:** while p and q are on the same side of a node, go that way; the first split point is the LCA
- **Steps:** both smaller → go left; both larger → go right; otherwise (split or equal) return this node
- **Complexity:** O(n) → O(h) time, O(h) → O(1) space
- **Pitfall:** a node can be its own ancestor: if p or q equals the current node, it's the answer
- **Related:** Validate Binary Search Tree, Kth Smallest Element in a BST, Binary Search
