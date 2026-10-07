---
title: Event Delegation
type: js
difficulty: medium
topic: dom
order: 4
env: dom
tags: [dom, events, closures]
estimatedMinutes: 20
---

Implement `delegate(root, eventType, selector, handler)`, which handles `eventType` events for every element inside `root` that matches the CSS `selector`, using **a single listener on `root`**. It returns an **unsubscribe** function that removes that listener.

- When an event of type `eventType` bubbles up to `root`, find the element matching `selector` that is the **closest** ancestor-or-self of `event.target`.
- If that element is **inside `root`** (a descendant, not `root` itself), call `handler` with `this` set to the matched element, the `event` as the first argument and the matched element as the second: `handler.call(match, event, match)`.
- **Nested matches:** only the closest match fires. If an `.item` sits inside another `.item`, clicking the inner one calls `handler` once, for the inner element.
- Events on elements outside `root` never call `handler`, even if those elements match `selector`.
- Elements added to `root` **after** `delegate` was called work too.

```js
document.body.innerHTML = `
  <ul id="list">
    <li class="item" data-id="1"><span>One</span></li>
    <li class="item" data-id="2">Two</li>
  </ul>`;

const list = document.getElementById('list');
const stop = delegate(list, 'click', '.item', (event, item) => {
  console.log(item.dataset.id);
});

list.querySelector('span').dispatchEvent(new Event('click', { bubbles: true })); // logs "1"
stop(); // removes the listener
```

**Constraints:** `delegate` calls `root.addEventListener` exactly **once**. If `event.target` is a text node, start from its parent element. Each `delegate` call is independent; unsubscribing one doesn't affect others.

## Notes

- **Approach:** add one listener to `root`. In it, take `event.target` (or its parent if it's not an element), call `target.closest(selector)`, and accept the match only if `root.contains(match)` and `match !== root`.
- **Why check `root`:** `closest` walks all the way up to `<html>`, so it can return `root` itself or an ancestor *above* `root` that happens to match. Neither is a delegated element.
- **Why only the closest match:** `closest` returns the nearest matching ancestor, so nested matches resolve to the innermost one. To fire for *every* matching ancestor up to `root` (jQuery's behaviour), walk up with `parentElement` and `matches(selector)` until you reach `root`.
- **`contains` fallback:** in environments without `Node.prototype.contains`, walk `parentNode` from the match until you hit `root` or `null`.
- **Why delegation:** one listener instead of N saves memory and set-up time, and dynamically added children work automatically.
- **Pitfalls:** events that don't bubble (`focus`, `blur`, `mouseenter`) need their bubbling counterparts (`focusin`, `focusout`, `mouseover`) or a capture-phase listener.
- **Complexity:** O(depth) per event for `closest`.
- **Follow-ups:**
  - **`stopPropagation`** inside a delegated handler (the event has already reached `root`).
  - **Several selectors** on one root sharing one listener.
  - **React's synthetic events:** React delegates every event to the root container.
