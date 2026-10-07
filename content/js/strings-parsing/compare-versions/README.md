---
title: Compare Versions
type: js
difficulty: easy
topic: strings-parsing
order: 3
tags: [strings, parsing, sorting]
estimatedMinutes: 10
---

Implement `compareVersions(a, b)`. It compares two dotted numeric version strings (like `'1.2.10'`) and returns:

- `-1` if `a` is lower than `b`,
- `1` if `a` is higher than `b`,
- `0` if they're equal.

Rules:

- Compare part by part from the left, **as numbers**: `'1.10'` is higher than `'1.9'`.
- A missing part counts as `0`: `'1.0'` equals `'1.0.0'`, and `'1'` equals `'1.0'`.
- Leading zeros don't matter: `'1.01'` equals `'1.1'`.

Because it returns a negative, zero or positive number, it can be passed straight to `Array.prototype.sort`.

```js
compareVersions('1.2.0', '1.10.0'); // -1
compareVersions('2.0', '1.9.9'); // 1
compareVersions('1.0', '1.0.0'); // 0
['1.10', '1.2', '1.9'].sort(compareVersions); // ['1.2', '1.9', '1.10']
```

**Constraints:** every part is a non-negative integer. There are no pre-release tags (`-beta`) or build metadata.

## Notes

- **Approach:** `split('.')` both strings and `map(Number)`. Loop up to the longer length, treating a missing part as `0` (`a[i] ?? 0`). Return as soon as two parts differ.
- **Pitfall:** comparing strings directly. `'1.10' < '1.9'` is `true` because `'1' < '9'` character by character.
- **Pitfall:** comparing the parts as strings has the same problem (`'10' < '9'`), and it also breaks on leading zeros.
- **Complexity:** O(n) in the number of parts.
- **Follow-ups:** full semver with pre-releases (`1.0.0-alpha < 1.0.0`), range checks (`^1.2.0`, `~1.2`), or finding the latest version in a list.
