---
title: getElementsByTagName
type: js
difficulty: medium
topic: dom
order: 2
env: dom
tags: [dom, tree-traversal, recursion]
estimatedMinutes: 15
---

Implement `getElementsByTagName(element, tagName)`, a version of the DOM method that works without `element.getElementsByTagName`, `querySelector` or `querySelectorAll`.

- Return an **array** of every **descendant** element of `element` (not `element` itself) whose tag name equals `tagName`.
- Matching is **case-insensitive**: `'DIV'`, `'div'` and `'Div'` all match `<div>`.
- `'*'` matches every descendant element.
- Results are in **document order** (depth-first, pre-order).

```js
document.body.innerHTML = `
  <div id="a">
    <span id="b"></span>
    <div id="c"><span id="d"></span></div>
  </div>`;

getElementsByTagName(document.body, 'span'); // → [span#b, span#d]
getElementsByTagName(document.body, 'DIV'); // → [div#a, div#c]
```

**Constraints:** text and comment nodes are never returned. Return a real array (`[]` when nothing matches), not a live collection. Use `element.children` and `tagName`.

## Notes

- **Approach:** normalise `tagName` to lower case once, then walk `children` depth-first. For each child, push it if `tagName === '*'` or `child.tagName.toLowerCase()` matches, then recurse.
- **Why lower-case both sides:** `tagName` is upper-case for HTML elements but keeps its case for SVG/XML elements (e.g. `foreignObject`). Comparing `localName` or the lower-cased name handles both.
- **Iterative version:** an explicit stack with children pushed in reverse preserves pre-order and avoids recursion limits on very deep trees.
- **Complexity:** O(n) for n descendants; O(h) extra space for recursion depth h.
- **Follow-ups:**
  - **Live `HTMLCollection`:** the native method returns a live collection that reflects later DOM changes. How would you emulate that (a `MutationObserver`, or recomputing on access)?
  - **`TreeWalker` / `NodeIterator`:** the built-in traversal APIs.
  - **Combined query:** tag *and* class, i.e. a tiny `querySelectorAll('div.card')`.
