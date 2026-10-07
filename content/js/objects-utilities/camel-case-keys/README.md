---
title: Camel Case Keys
type: js
difficulty: medium
topic: objects-utilities
order: 17
tags: [objects, recursion, strings]
estimatedMinutes: 15
---

Implement `camelCaseKeys(value)`. It returns a copy of `value` in which every object key is converted to **camelCase**, recursively. This is the usual job of turning a `snake_case` API response into JS-friendly objects.

- **Converting a key:**
  - split it into words on runs of `_`, `-` and whitespace, ignoring empty pieces (so leading, trailing or repeated separators vanish);
  - lower-case the **first letter of the first word** and upper-case the **first letter of every later word**;
  - leave all other letters as they are, so a key that is already camelCase stays the same.
- **Recursion:** plain objects get their keys converted and their values processed; arrays are mapped element by element. Objects inside arrays are converted too.
- **Values are never changed:** a string value like `'first_name'` stays as it is.
- **Returned as is (same reference):** primitives, `null`, and non-plain objects such as `Date`, `Map` or class instances. Their keys are not touched.
- Do **not** mutate `value`.

```js
camelCaseKeys({ first_name: 'Ada', 'Last-Name': 'Lovelace', home_address: { zip_code: '123' } });
// { firstName: 'Ada', lastName: 'Lovelace', homeAddress: { zipCode: '123' } }

camelCaseKeys([{ user_id: 1, 'is active': true }]);
// [{ userId: 1, isActive: true }]

camelCaseKeys({ alreadyCamel: 1, __private_key: 2 });
// { alreadyCamel: 1, privateKey: 2 }
```

**Constraints:** primitives at the top level are returned unchanged (`camelCaseKeys('a_b')` is `'a_b'`).

## Notes

- **Key conversion:** `key.split(/[\s_-]+/).filter(Boolean).map((w, i) => (i === 0 ? lowerFirst(w) : upperFirst(w))).join('')`. A regex replace such as `/[\s_-]+(\w)/g` → upper-case also works, but you still have to strip leading separators and lower-case the first letter.
- **Plain-object check:** compare the prototype with `Object.prototype`/`null`. Otherwise a `Date` goes through `Object.entries`, comes back as `{}` and silently loses its value.
- **Pitfalls:** converting values as well as keys; only handling the top level; forgetting arrays of objects; key collisions (`a_b` and `aB` both map to `aB`, and the later one wins).
- **Complexity:** O(total nodes + total key length).
- **Follow-ups:** the reverse (`snakeCaseKeys`, where acronyms like `userID` get tricky), an `exclude` list for keys such as IDs or headers, typing the result with TypeScript template literal types, and caching converted keys.
