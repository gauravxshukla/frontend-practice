---
title: Job Board
type: react
difficulty: medium
tags: [async, fetch, pagination]
estimatedMinutes: 40
---

Build a Hacker News job board.

**APIs**
- Job IDs: `https://hacker-news.firebaseio.com/v0/jobstories.json` (an array of ids, newest first)
- Job details: `https://hacker-news.firebaseio.com/v0/item/{id}.json` (`{ id, by, time, title, url? }`)

**Requirements**
- On load, show the first **6** jobs. Each card shows the title, the poster (`by`) and the date (`time` is in seconds).
- If a job has a `url`, the title links to it in a new tab.
- A **Load more jobs** button fetches and appends the next 6. Hide it when there are no more.
- Show a loading state for the first load and while loading more. Disable the button while a request is in flight.

## Notes

- Fetch the id list **once**, then fetch details a page at a time: `Promise.all(ids.slice(start, start + 6).map(fetchItem))`.
- The original attempt fetched details for *every* id up front (≈200 requests), and "Load more" re-ran the whole thing, which appended duplicates. Paging fixes both.
- Business logic first (a `fetchJobs(page)` function), then the UI. Interviewers like to see that order.
- `new Date(time * 1000).toLocaleString()` is fine for the date.
- StrictMode runs effects twice in dev, so guard the initial fetch (an `ignore` flag in the effect cleanup) to avoid a double first page.
