---
title: List Format
type: js
difficulty: medium
topic: strings-parsing
order: 1
tags: [strings, arrays, formatting]
estimatedMinutes: 20
---

Implement `listFormat(items, options?)`. It turns an array of strings into a human-readable list.

- Zero items → `''`. One item → `'a'`. Two items → `'a and b'`.
- Three or more → items separated by `', '`, with `' and '` before the last: `'a, b and c'` (no Oxford comma).
- Empty strings are removed before formatting.

**Options** (all optional):

- `unique: true` removes duplicates, keeping the first occurrence.
- `sorted: true` sorts the items (default string order, as `Array.prototype.sort()` does).
- `length: n` shows only the first `n` items, followed by `' and X other'` when one item is hidden or `' and X others'` when more are. If `n` is greater than or equal to the number of items, or `n <= 0`, ignore it.

The steps run in this order: remove empty strings, then `unique`, then `sorted`, then `length`.

```js
listFormat([]); // ''
listFormat(['Bob']); // 'Bob'
listFormat(['Bob', 'Alice']); // 'Bob and Alice'
listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John']); // 'Bob, Ben, Tim, Jane and John'
listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'], { length: 3 }); // 'Bob, Ben, Tim and 2 others'
listFormat(['Bob', 'Ben', 'Tim', 'Jane'], { length: 3 }); // 'Bob, Ben, Tim and 1 other'
listFormat(['Bob', 'Ben', 'Bob', 'Ben'], { unique: true }); // 'Bob and Ben'
listFormat(['Bob', 'Ben', 'Tim'], { sorted: true }); // 'Ben, Bob and Tim'
```

**Constraints:** don't mutate `items`. The "others" count is based on the list after removing empty strings and duplicates.

## Notes

- **Approach:** build a cleaned copy (`filter(Boolean)`, then `[...new Set(list)]` for `unique`, then `.sort()` for `sorted`). If `length` is a valid cut, format `list.slice(0, n).join(', ')` plus the "others" suffix. Otherwise join all but the last with `', '` and append `' and ' + last`.
- **Set keeps insertion order**, so it removes duplicates while keeping each first occurrence.
- **Pitfall:** `items.sort()` sorts in place and mutates the caller's array. Sort a copy.
- **Pitfall:** applying `length` before `unique` gives the wrong "others" count.
- **Complexity:** O(n log n) when sorted, O(n) otherwise.
- **Real world:** `Intl.ListFormat` handles locales, Oxford commas and "or" lists: `new Intl.ListFormat('en', { type: 'conjunction' }).format(items)`.
- **Follow-ups:** an Oxford-comma option, a custom conjunction ("or"), localisation, or a "+2 more" UI label.
