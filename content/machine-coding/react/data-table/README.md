---
title: Data Table (pagination)
type: react
difficulty: medium
tags: [state, pagination, tables]
estimatedMinutes: 30
---

`users.js` holds a list of users. `App.js` renders all of them in a table. Add pagination.

**Table**
- Columns: Id, Name, Age, Occupation. One row per user.

**Pagination**
- Previous / Next buttons to move between pages. Disable them at the ends.
- Show the current page and the total number of pages, e.g. `Page 2 of 8`.
- A select to choose the page size: 5, 10 or 20. Changing it goes back to page 1.

## Notes

- State is just `page` and `pageSize`. Everything else is **derived**: `totalPages = Math.ceil(users.length / pageSize)` and `users.slice((page - 1) * pageSize, page * pageSize)`. Don't store the sliced list in state.
- A `paginate(list, page, pageSize)` pure function keeps the component small and is easy to unit test.
- Reset `page` to 1 when `pageSize` changes, otherwise you can land past the last page.
- Follow-ups (Data Table II/III): sortable columns (store `{ key, direction }`, sort before paginating), then filtering. Keep the order filter → sort → paginate.
