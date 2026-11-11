---
title: Serialize and Deserialize Binary Tree
type: dsa
difficulty: hard
topic: trees
order: 15
neetcode: true
tags: [trees, design, dfs, bfs, strings]
estimatedMinutes: 30
---

Write two functions that convert a binary tree to a **string** and back:

- `serialize(root)` returns a string that encodes the whole tree, including its shape.
- `deserialize(data)` takes that string and rebuilds an identical tree.

You choose the format. The only requirement is that `deserialize(serialize(tree))` gives back the same shape and values. Trees may be empty and may contain negative or repeated values.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. In the examples, trees are shown in level order, with `null` marking a missing child.

```js
function serialize(root)   // → string
function deserialize(data) // → root
export default { serialize, deserialize };
```

## Examples

```text
Input:  root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
Explanation: the tests run deserialize(serialize(root)) and compare it with the original tree.

Input:  root = []
Output: []
```

## Constraints

- 0 ≤ number of nodes ≤ 10⁴
- −1000 ≤ `node.val` ≤ 1000
- Store all state in the string, not in module variables.

## Notes

- **Identify:** turn a tree into a string and back → preorder DFS with null markers
- **Brute force:** level-order with nulls padded for every missing position, which bloats on skewed trees
- **Insight:** preorder plus an explicit marker for each null child fixes the shape uniquely
- **Steps:** serialize: write val then left then right, "#" for null; deserialize: read tokens in the same order
- **Complexity:** O(n) time and space both ways; null markers keep it O(n) even for skewed trees
- **Pitfall:** without null markers different shapes give the same string; values can be negative
- **Related:** Construct Binary Tree from Preorder and Inorder Traversal, Encode and Decode Strings, Same Tree
