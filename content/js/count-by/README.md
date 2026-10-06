---
title: countBy
type: js
difficulty: easy
tags: [lodash, objects, arrays]
estimatedMinutes: 10
---

Implement `countBy(array, iteratee)`. It returns an object whose keys are the results of calling `iteratee` on each element, and whose values are how many elements produced that key.

```js
countBy([6.1, 4.2, 6.3], Math.floor);           // { '4': 1, '6': 2 }
countBy(['one', 'two', 'three'], (s) => s.length); // { '3': 2, '5': 1 }
countBy([], Math.floor);                          // {}
```

## Notes

- `result[key] = (result[key] ?? 0) + 1` is the whole loop body.
- Use `forEach`/`for...of`, not `map`, when you don't need the returned array (the original used `map` for side effects).
- Use `Object.hasOwn`, not `in`. A key like `'constructor'` exists on every object's prototype. An even safer option is `Object.create(null)`.
