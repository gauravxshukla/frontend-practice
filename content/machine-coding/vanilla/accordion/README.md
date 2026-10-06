---
title: Accordion
type: vanilla
difficulty: easy
tags: [dom, events, accessibility]
estimatedMinutes: 25
---

The starter already renders three accordion sections (HTML, CSS, JavaScript) with their contents hidden. Make them interactive:

- Clicking a section's title toggles its contents open/closed.
- Several sections can be open at the same time.
- The chevron icon rotates when open (`accordion-icon--rotated` is already in the CSS).
- Keep `aria-expanded` on the title button in sync.

## Notes

- **Event delegation:** one `click` listener on the root, then `event.target.closest('.accordion-item-title')`, instead of a listener per button. It scales and works for sections added later.
- Find the contents via `$title.nextElementSibling`, or by `data-value`, and flip `hidden`.
- `aria-expanded` on the button, plus `aria-controls` pointing at the content's id, is the full disclosure pattern.
- Follow-ups (Accordion II/III): only one section open at a time, then full keyboard support (Up/Down/Home/End between headers).
