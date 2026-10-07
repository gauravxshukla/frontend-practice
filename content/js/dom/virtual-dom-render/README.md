---
title: Virtual DOM Render
type: js
difficulty: medium
topic: dom
order: 6
env: dom
tags: [dom, virtual-dom, recursion, react]
estimatedMinutes: 25
---

Implement `render(vnode)`, which turns a virtual-DOM description into a real DOM node and returns it (it doesn't attach it anywhere).

A vnode is either:

- a **string or number**, rendered as a **text node** (so `'<b>'` stays literal text, never markup); or
- an object `{ type, props, children }`, rendered as `document.createElement(type)`. `props` and `children` are optional.

Props are applied like this:

- `className` sets the `class` attribute.
- `style` given as an object sets each property: `{ fontSize: '12px' }` → `el.style.fontSize = '12px'`.
- A prop named `on` + an upper-case letter whose value is a function (`onClick`) is added as an event listener for the lower-cased event name (`'click'`).
- `true` sets an empty attribute (`disabled=""`); `false`, `null` and `undefined` set nothing.
- Every other prop is set with `setAttribute(name, String(value))`.

Children are rendered recursively and appended in order. `null`, `undefined`, `false` and `true` children are skipped; `0` is rendered.

```js
const button = render({
  type: 'button',
  props: { className: 'primary', onClick: () => console.log('clicked') },
  children: ['Save ', { type: 'b', children: [3] }],
});

button.outerHTML; // '<button class="primary">Save <b>3</b></button>'
button.dispatchEvent(new Event('click')); // logs "clicked"
```

**Constraints:** don't use `innerHTML`. The vnode is not mutated.

## Notes

- **Approach:** recursion. For primitives, `document.createTextNode(String(vnode))`. For elements, create the element, loop over `Object.entries(props)` applying the rules above, then `appendChild(render(child))` for each non-skipped child.
- **Why `createTextNode`, not `innerHTML`:** text nodes are never parsed, so user content can't inject markup. That's how React escapes by default (and why `dangerouslySetInnerHTML` is named that way).
- **`className` vs `class`:** JSX uses the DOM property name, `className`, because `class` is a reserved word.
- **Boolean props:** `false` must mean "absent". `setAttribute('disabled', 'false')` still disables a button.
- **Complexity:** O(n + p) for n nodes and p props.
- **Follow-ups:**
  - **Diff and patch:** given an old and a new vnode, update the existing DOM in place (keys, reordering).
  - **Components:** `type` as a function that returns a vnode.
  - **Properties vs attributes:** `value`, `checked` should be set as properties.
  - **Removing listeners** when a vnode is unmounted; SVG namespaces with `createElementNS`.
