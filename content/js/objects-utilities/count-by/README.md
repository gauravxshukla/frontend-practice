---
title: countBy
type: js
difficulty: easy
topic: objects-utilities
order: 7
tags: [lodash, objects, arrays]
estimatedMinutes: 10
---

Implement `countBy(array, iteratee)`. It returns an object whose keys are the results of calling `iteratee` on each element, and whose values are how many elements produced that key.

- `iteratee` is a **function**. Call it **once per element**, in array order, with the element as its first argument.
- The key is the iteratee's result converted to a string, as with any property key: `true` → `'true'`, `undefined` → `'undefined'`, `4` → `'4'`.
- Each value is a **number**, and the counts add up to `array.length`.
- Keys that happen to exist on `Object.prototype`, such as `'constructor'`, `'toString'` or `'hasOwnProperty'`, must be counted like any other key.
- Return a new object on every call, `{}` for an empty array, and don't mutate the input.

```js
countBy([6.1, 4.2, 6.3], Math.floor); // { '4': 1, '6': 2 }
countBy(['one', 'two', 'three'], (s) => s.length); // { '3': 2, '5': 1 }
countBy([1, 2, 3], (n) => n % 2 === 0); // { false: 2, true: 1 }
countBy([], Math.floor); // {}
```

**Constraints:** `array` is always an array and `iteratee` is always a function. A string iteratee like lodash's `countBy(users, 'role')` is not required.

## Notes

- **Approach:** one pass with `for...of` or `forEach`: `const key = iteratee(item)`, then add 1 to `result[key]` if it's an own key, or set it to 1.
- **Pitfalls:** `result[key] = (result[key] ?? 0) + 1` looks complete, but for `'constructor'` it reads the inherited `Object` function and stores the string `'function Object() { [native code] }1'`. Use `Object.hasOwn(result, key)`, or build on `Object.create(null)`. `result.hasOwnProperty(key)` breaks once `'hasOwnProperty'` itself has been counted. Use `forEach`/`for...of`, not `map`, when you don't need the returned array (the original used `map` for side effects).
- **Complexity:** O(n) time, O(k) space for k distinct keys.
- **Follow-ups:** a string or property-path iteratee like lodash; returning a `Map` so keys keep their type; and building it on top of `groupBy` or with `reduce`.
