---
title: Copy List with Random Pointer
type: dsa
difficulty: medium
topic: linked-list
order: 6
neetcode: true
tags: [linked-list, hash-map, deep-copy]
estimatedMinutes: 20
---

Each node of this linked list has an extra pointer, `random`, that can point to **any** node in the list or be `null`. Build a **deep copy**: a brand-new list with the same values where every copied `next` and `random` points to the corresponding *copied* node. No pointer in the copy may refer to a node from the original list. Return the head of the copy.

Random-list nodes are plain objects: `{ val, next, random }`.

In the examples a list is written as `[[val, randomIndex], ...]`, where `randomIndex` is the 0-based position of the node that `random` points to, or `null`.

```js
function copyRandomList(head) // → head of the copy
```

## Examples

```text
Input:  head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]

Input:  head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
Explanation: both random pointers point at the second node, including the second node's own.
```

The output looks identical to the input because it's a faithful copy. The judge also rejects any answer that reuses an original node.

## Constraints

- 0 ≤ number of nodes ≤ 1000
- −10⁴ ≤ `node.val` ≤ 10⁴
- `random` is `null` or points to a node in the same list.

## Notes

- **Identify:** deep copy where random can point anywhere → map each original node to its copy
- **Brute force:** for each random, find its target's position by scanning from the head, O(n²)
- **Better:** interleave copies inside the original list for O(1) extra space, at the cost of clarity
- **Insight:** a map from original to copy lets every next and random be wired in O(1)
- **Steps:** pass 1 creates a copy of each node in the map; pass 2 sets copy.next and copy.random via the map
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** map null to null, so tail.next and empty random pointers copy cleanly
- **Related:** Clone Graph, LRU Cache, Reverse Linked List
