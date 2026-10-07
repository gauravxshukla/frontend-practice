---
title: HTML Serializer
type: js
difficulty: medium
topic: dom
order: 5
tags: [recursion, strings, tree-traversal]
estimatedMinutes: 15
---

Implement `serializeHTML(tree, indent = '  ')`, which turns a plain-object tree into indented HTML. No real DOM is involved.

A tree node is either a **string** (a text node) or an object `{ tag, children }`, where `children` is an array of nodes.

- Put each opening tag, closing tag and text node on **its own line**, joined with `'\n'` (no trailing newline).
- The root is not indented. Each level of nesting adds one `indent` (two spaces by default; the second argument changes it, e.g. `'\t'`).
- An element's children appear between its opening and closing tags, one level deeper. An element with no children (an empty or missing `children` array) is still written as an opening line followed by a closing line.
- Text is written **as-is** (no escaping or trimming).

```js
serializeHTML({ tag: 'div', children: [{ tag: 'b', children: ['hi'] }] });
// '<div>\n  <b>\n    hi\n  </b>\n</div>'
```

which prints as

```
<div>
  <b>
    hi
  </b>
</div>
```

**Constraints:** a string at the root is returned unchanged. The tree is not mutated. Trees can be deep and wide.

## Notes

- **Approach:** a recursive helper `lines(node, depth)` that returns an array of lines: `[pad + '<tag>', ...children.flatMap((c) => lines(c, depth + 1)), pad + '</tag>']`, where `pad = indent.repeat(depth)`. Join once at the end.
- **Why collect lines, not concatenate strings:** joining once avoids worrying about stray separators and keeps the "no trailing newline" rule trivial.
- **Complexity:** O(n · d) characters of output for n nodes at depth up to d, because of the padding.
- **Pitfalls:** off-by-one indentation for the closing tag (it uses the element's depth, not its children's), and treating `children` as required.
- **Follow-ups:**
  - **Attributes:** `{ tag, attrs, children }` with escaped attribute values.
  - **Escaping text:** `&`, `<`, `>` in text nodes; the security reason for doing so.
  - **Void elements** (`<br>`, `<img>`) with no closing tag; inline elements kept on one line.
  - **The reverse:** parse indented HTML back into the object tree.
