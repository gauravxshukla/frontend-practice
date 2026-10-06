---
title: Nested Comments
type: react
difficulty: hard
tags: [recursion, state, tree]
estimatedMinutes: 45
---

Build a comment thread with unlimited nesting.

- Show a list of comments. Each comment has text, an author and a **Reply** button.
- Replying opens an inline input under that comment. Submitting adds a child comment.
- Replies are indented under their parent, to any depth.
- Bonus: edit and delete (deleting a comment removes its replies), and collapse/expand a thread.

Think about the data shape first: a nested tree, or a flat `{ [id]: { text, parentId } }` map?
