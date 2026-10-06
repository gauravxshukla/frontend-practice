---
title: Todo List
type: vanilla
difficulty: easy
tags: [dom, events, forms]
estimatedMinutes: 20
---

Build a todo list in plain JavaScript.

- It starts with three tasks: "Walk the dog", "Water the plants", "Wash the dishes".
- A form with a text input and a submit button adds a task to the end of the list. Ignore empty input and clear the field after adding.
- Each task has a **Delete** button that removes it.

## Notes

- The reference (the original solution) keeps a `taskList` array as the source of truth and re-renders the whole list on every change. That's simple and predictable, like a tiny React.
- `deleteTask` removes by **text**, so two identical tasks share a fate: deleting one removes the first match, which may not be the one clicked. Delete by index or id instead.
- It renders text with `innerText`, which is safe. Never build task markup with `innerHTML` and user input (XSS).
- An alternative is to mutate the DOM directly: append one `<li>` on add, and `li.remove()` on delete. It's cheaper for big lists but leaves two sources of truth.
- Fixed from the original: it never called `renderTask()` on startup (the three seed tasks only appeared after the first add), and it didn't clear the input after adding.
