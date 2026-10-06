---
title: Paginated Posts
type: react
difficulty: medium
tags: [async, fetch, pagination]
estimatedMinutes: 30
---

Fetch posts from `https://dummyjson.com/posts` and display them with **server-side** pagination.

- The API supports `?limit=<n>&skip=<n>` and returns `{ posts: [{ id, title, body }], total, skip, limit }`.
- Show each post's title and body.
- Prev / Next buttons and `Page X of Y`. Disable the buttons at the ends.
- A page-size select (5, 10, 20). Changing it resets to page 1.
- Show a loading state while a page is being fetched, and an error message if the request fails.

## Notes

- Derive `skip = (page - 1) * pageSize`, and refetch in an effect keyed on `[page, pageSize]`.
- `total` comes from the response. Store it so `totalPages` can be computed.
- Race condition: switching pages quickly can let an older response land last. Use an `ignore` flag in the effect cleanup (or an `AbortController`) to drop stale responses.
- The original attempt fetched once and rendered all posts. The pagination requirement in its comments wasn't implemented yet.
