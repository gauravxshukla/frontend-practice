---
title: Identical DOM Trees
type: js
difficulty: medium
topic: dom
order: 3
env: dom
tags: [dom, tree-traversal, recursion]
estimatedMinutes: 20
---

Implement `identicalDOMTrees(a, b)`, which returns `true` if the two DOM nodes describe the same tree and `false` otherwise. Don't use `isEqualNode`.

Two nodes are identical when:

- they have the same `nodeType`;
- **elements** have the same tag name and the same **set of attributes** (same names and values; the **order** they were written in doesn't matter);
- **text** and **comment** nodes have exactly the same content;
- they have the same number of child nodes (`childNodes`, so text and comments count), and each pair of children at the same position is identical, recursively.

```js
const parse = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
};

identicalDOMTrees(parse('<p class="x" id="1">hi</p>'), parse('<p id="1" class="x">hi</p>')); // true
identicalDOMTrees(parse('<p>hi</p>'), parse('<p>hi!</p>')); // false
```

**Constraints:** whitespace-only text nodes are compared like any other text (`<p> </p>` differs from `<p></p>`). A node is identical to itself. Event listeners and JS properties are not compared, only the markup-level tree.

## Notes

- **Approach:** a recursive comparison that fails fast: check `nodeType`; for elements, `tagName`, attribute count and each `a` attribute against `b.getAttribute(name)`; for text and comments, `nodeValue`; then the `childNodes` lengths and each pair recursively.
- **Attribute order:** comparing `attributes.length` plus "every attribute of `a` exists on `b` with the same value" is order-independent and O(k). Comparing `outerHTML` strings fails here because serialisation keeps source order.
- **`hasAttribute` vs `getAttribute`:** `getAttribute` returns `null` for a missing attribute, which can't equal a real (string) value, so the length check plus `getAttribute` is enough.
- **Complexity:** O(n · k) for n nodes with up to k attributes each; O(h) stack depth.
- **Iterative version:** push pairs `[nodeA, nodeB]` onto a stack.
- **Follow-ups:**
  - **`Node.isEqualNode`:** the built-in equivalent.
  - **Normalising whitespace** or ignoring comments: an `options` argument.
  - **Diffing:** instead of a boolean, return the path to the first difference (the basis of virtual-DOM reconciliation).
  - **Class order:** should `class="a b"` equal `class="b a"`?
