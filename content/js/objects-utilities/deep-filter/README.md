---
title: Deep Filter
type: js
difficulty: medium
topic: objects-utilities
order: 16
tags: [objects, recursion]
estimatedMinutes: 20
---

Implement `deepFilter(obj, predicate)`. `obj` is a plain object or an array. The function returns a copy that keeps only the **leaf** values for which `predicate(value)` returns truthy.

- **Leaves:** anything that isn't a plain object or array. That covers primitives, `null`, `undefined`, functions, and non-plain objects such as `Date`.
- **Calling the predicate:** it is called once per leaf, with the leaf value as its only argument. It is never called with a plain object or array.
- **Plain objects:** keep the keys whose (filtered) value survives.
- **Arrays:** filtered element-wise, so the survivors are packed together with no holes and their order is kept.
- **Pruning:** a nested object or array that ends up empty is removed from its parent. That includes containers that were empty to begin with.
- **The top level** is never removed. If nothing survives, return `{}` or `[]` (matching the input's type).
- Do **not** mutate `obj`.

```js
const data = { a: 1, b: { c: 'x', d: 2 }, e: [1, 'y', { f: 3 }], g: { h: 'z' } };

deepFilter(data, (v) => typeof v === 'number');
// { a: 1, b: { d: 2 }, e: [1, { f: 3 }] }   (g became empty, so it's gone)

deepFilter([1, [2, 'x'], ['y']], (v) => typeof v === 'number');
// [1, [2]]
```

**Constraints:** the result contains only new plain objects and arrays. Leaves are kept by reference.

## Notes

- **Approach:** a recursive `walk` that returns either the filtered value or a sentinel (`const REMOVE = Symbol()`) meaning "drop me". Containers collect the children that aren't `REMOVE`, and return `REMOVE` themselves when nothing is left. At the top, swap `REMOVE` for an empty container.
- **Why a sentinel:** `undefined` or `null` can be legitimate leaves that the predicate keeps, so they can't double as "removed".
- **Pitfalls:** `array.filter` alone can't prune nested arrays that become empty. Using `delete`/`splice` on the input mutates it. Calling the predicate on containers lets it drop whole subtrees by accident.
- **Complexity:** O(total number of nodes).
- **Follow-ups:** pass `(value, key, path)` to the predicate, an option to keep empty containers, and how this relates to `JSON.stringify`'s replacer.
