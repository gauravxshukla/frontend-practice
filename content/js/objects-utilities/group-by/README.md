---
title: groupBy
type: js
difficulty: easy
topic: objects-utilities
order: 6
tags: [lodash, objects, arrays]
estimatedMinutes: 10
---

Implement `groupBy(array, iteratee)`. It returns an object whose keys are the results of calling `iteratee` on each element, and whose values are arrays of the elements that produced that key, in their original order.

- `iteratee` is a **function**. Call it **once per element**, in array order, with the element as its first argument.
- The key is the iteratee's result converted to a string, as with any property key: `true` → `'true'`, `undefined` → `'undefined'`, `4` → `'4'`.
- Each group holds the **original elements** (same references), in input order. Duplicates are all kept.
- Keys that happen to exist on `Object.prototype`, such as `'constructor'` or `'toString'`, must work like any other key.
- Return a new object on every call, `{}` for an empty array, and don't mutate the input.

```js
groupBy([6.1, 4.2, 6.3], Math.floor); // { '4': [4.2], '6': [6.1, 6.3] }
groupBy(['one', 'two', 'three'], (s) => s.length); // { '3': ['one', 'two'], '5': ['three'] }
groupBy([1, 2, 3], (n) => n % 2 === 0); // { false: [1, 3], true: [2] }
```

**Constraints:** `array` is always an array and `iteratee` is always a function. A string iteratee like lodash's `groupBy(users, 'age')` is not required.

## Notes

- **Approach:** one pass. `const key = iteratee(item)`; if `result` already has its own `key`, push the item, otherwise start a new array `[item]`. The same shape as `countBy`, except you push instead of incrementing.
- **Pitfalls:** `if (result[key])` or `key in result` finds inherited properties, so a `'constructor'` key tries to push onto `Object` and throws. Use `Object.hasOwn(result, key)`, or build on `Object.create(null)`. A `'__proto__'` key on a plain `{}` still hits the prototype setter; only a null-prototype object or a `Map` is fully safe. `arr.forEach(iteratee)` style calls pass the index and array as extra arguments, which can surprise iteratees like `parseInt`.
- **Complexity:** O(n) time and space.
- **Follow-ups:** a string or property-path iteratee like lodash; returning a `Map` so keys keep their type (`Map.groupBy`); and how the native `Object.groupBy(arr, fn)` (ES2024) returns a null-prototype object.
