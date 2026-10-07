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

- **Key insight:** a traversal alone doesn't fix a tree's shape, but a traversal **with null markers** does.
- **Pre-order DFS:** write each value and a `#` for every missing child, joined by commas. To decode, read tokens in the same order: `#` means null, otherwise make a node and build its left and then its right subtree. O(n) time and space for both directions.
- **Level-order BFS:** the same idea, close to how LeetCode prints trees. Decoding pairs each dequeued node with the next two tokens.
- Use a delimiter. Without one, `12` and `1,2` look the same, and negative numbers are ambiguous.
- Pitfall: decoding with `split` and then `shift()` on every token is O(n²). Use an index pointer.
- Pitfall: very deep (skewed) trees can overflow a recursive encoder or decoder. An iterative version avoids that.
- Pitfall: encoding without null markers, then trying to recover the shape from values alone.
- Follow-up: for a BST, pre-order without nulls is enough, because the value bounds recover the shape (Serialize and Deserialize BST).
- Follow-up: make it compact, e.g. with binary encoding or by trimming trailing nulls in level order.
