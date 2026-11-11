---
title: Subtree of Another Tree
type: dsa
difficulty: easy
topic: trees
order: 6
neetcode: true
tags: [trees, recursion, dfs, hashing]
estimatedMinutes: 15
---

You get two binary trees, `root` and `subRoot`. Return `true` if some node in `root` is the top of a subtree that is **identical** to `subRoot`: the same shape and values, all the way down to the leaves. `root` counts as a subtree of itself.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isSubtree(root, subRoot) // → boolean
```

## Examples

```text
Input:  root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true

Input:  root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
Output: false
Explanation: the node 4 in root has an extra 0 under its child 2, so its subtree is not identical.
```

## Constraints

- 1 ≤ number of nodes in `root` ≤ 2000
- 1 ≤ number of nodes in `subRoot` ≤ 1000
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Identify:** does subRoot appear exactly somewhere in root → Same Tree check at every node
- **Brute force:** at every node of root, run Same Tree against subRoot, O(m·n)
- **Better:** serialise both with null markers and do a substring search, O(m + n) with KMP
- **Insight:** a match must start at some node, so try Same Tree there and recurse on both children otherwise
- **Steps:** subRoot null → true; root null → false; sameTree(root, subRoot) or recurse left or right
- **Complexity:** O(m·n) time, O(h) space (the serialise + KMP version is O(m + n))
- **Pitfall:** a matching value isn't enough; the whole subtree, down to the leaves, must match
- **Related:** Same Tree, Invert Binary Tree, Serialize and Deserialize Binary Tree
