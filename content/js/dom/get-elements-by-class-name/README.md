---
title: getElementsByClassName
type: js
difficulty: medium
topic: dom
order: 1
env: dom
tags: [dom, tree-traversal, recursion]
estimatedMinutes: 20
---

Implement `getElementsByClassName(element, classNames)`, a version of the DOM method that works without `element.getElementsByClassName`, `querySelectorAll` or `classList.contains`.

- `classNames` is a string of one or more class names separated by whitespace, e.g. `'card active'`.
- Return an **array** of every **descendant** element of `element` (not `element` itself) whose `class` attribute contains **all** of those class names, in any order.
- Results are in **document order** (depth-first, pre-order).
- Matching is case-sensitive and by whole class name: `'act'` does not match `class="active"`.

```js
document.body.innerHTML = `
  <div class="card active">
    <p class="active">One</p>
    <section class="card"><span class="active card">Two</span></section>
  </div>`;

getElementsByClassName(document.body, 'card active');
// → [div.card.active, span.active.card]
```

**Constraints:** `classNames` may have extra spaces, tabs or newlines. If it contains no class names, return `[]`. Use `element.children` and `element.getAttribute('class')`.

## Notes

- **Approach:** split `classNames` on `/\s+/` and drop empty strings to get the targets. Walk the tree depth-first: for each child, check whether its own class list (`getAttribute('class')` split the same way) contains every target. If it does, push it. Either way, recurse into its children.
- **Why `children`, not `childNodes`:** `childNodes` includes text and comment nodes, which have no attributes. If you use `childNodes`, filter by `nodeType === Node.ELEMENT_NODE`.
- **Whole-name matching:** splitting into a `Set` avoids the substring trap `className.includes('act')`.
- **Complexity:** O(n · k) for n descendants and k target classes. With a `Set` of the element's classes, each check is O(k).
- **Iterative version:** use an explicit stack, pushing children in reverse so pre-order is preserved. This avoids recursion limits on very deep trees.
- **Follow-ups:**
  - **Live `HTMLCollection` vs static array:** the real method returns a live collection that updates as the DOM changes.
  - **`getElementsByTagName`:** the same walk with a tag comparison (`tagName` is upper-case for HTML).
  - **Simple selector matching:** `.a.b`, `div.a`.
