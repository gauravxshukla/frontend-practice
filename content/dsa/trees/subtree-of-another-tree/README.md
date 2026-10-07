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

- **Key insight:** reuse Same Tree. At each node of `root`, ask whether the tree starting there equals `subRoot`.
- **Straightforward:** DFS over `root` and call `sameTree(node, subRoot)` at every node. O(n · m) worst case, O(h) stack. This is the standard interview answer.
- **Faster:** serialize both trees in pre-order with null markers, then check substring containment with KMP. O(n + m).
- **Also faster:** Merkle-style hashing. Hash each subtree from its value and its children's hashes, then compare hashes (and confirm matches to avoid collisions).
- Pitfall with serialization: without delimiters, `12` contains `2`. Wrap every value, e.g. `,12,` vs `,2,`.
- Pitfall: matching only the top part. The subtree must match all the way to the leaves, so `[1,2,3]` doesn't contain `[1,2]`.
- Pitfall: stopping at the first node whose value equals `subRoot.val`. Duplicate values mean you must keep searching.
- Follow-up: count how many subtrees match, or find all duplicate subtrees (hash map of serializations).
