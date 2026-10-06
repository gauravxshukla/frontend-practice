---
title: groupBy
type: js
difficulty: easy
tags: [lodash, objects, arrays]
estimatedMinutes: 10
---

Implement `groupBy(array, iteratee)`. It returns an object whose keys are the results of calling `iteratee` on each element, and whose values are arrays of the elements that produced that key, in their original order.

```js
groupBy([6.1, 4.2, 6.3], Math.floor);          // { '4': [4.2], '6': [6.1, 6.3] }
groupBy(['one', 'two', 'three'], (s) => s.length); // { '3': ['one', 'two'], '5': ['three'] }
```

## Notes

- Same shape as `countBy`, but you push the item instead of incrementing.
- `Object.groupBy(arr, fn)` (ES2024) does this natively and returns a null-prototype object.
- Follow-up: accept a string iteratee (`groupBy(users, 'age')`) the way lodash does.
