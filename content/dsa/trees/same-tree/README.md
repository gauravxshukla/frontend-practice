---
title: Same Tree
type: dsa
difficulty: easy
topic: trees
order: 5
neetcode: true
tags: [trees, recursion, dfs]
estimatedMinutes: 10
---

You get the roots of two binary trees, `p` and `q`. Return `true` if they are identical: the same shape, with equal values in matching positions. Two empty trees are identical.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isSameTree(p, q) // → boolean
```

## Examples

```text
Input:  p = [1,2,3], q = [1,2,3]
Output: true

Input:  p = [1,2], q = [1,null,2]
Output: false
Explanation: the 2 is a left child in p but a right child in q.

Input:  p = [1,2,1], q = [1,1,2]
Output: false
```

## Constraints

- 0 ≤ number of nodes in each tree ≤ 100
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Identify:** same shape and same values → compare both trees node by node (DFS)
- **Brute force:** serialise both trees with null markers and compare the strings, O(n) extra space
- **Insight:** two trees match if the roots match and both pairs of subtrees match
- **Steps:** both null → true; one null or values differ → false; else recurse on left pair and right pair
- **Complexity:** O(n) → O(n) time, O(n) → O(h) space
- **Pitfall:** check the null cases before reading .val
- **Related:** Subtree of Another Tree, Invert Binary Tree, Maximum Depth of Binary Tree
