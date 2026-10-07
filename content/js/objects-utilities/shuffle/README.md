---
title: Shuffle
type: js
difficulty: easy
topic: objects-utilities
order: 5
tags: [array, random, algorithms]
estimatedMinutes: 10
---

Implement `shuffle(array, random = Math.random)`. It returns a **new** array containing the same elements in a uniformly random order, using the **Fisher–Yates** shuffle.

- Every permutation must be equally likely.
- Do **not** mutate `array`: copy it first and shuffle the copy.
- `random` is an optional source of numbers in `[0, 1)` (it defaults to `Math.random`). Tests pass a predictable generator, so use it exactly like this:
  - walk `i` from the **last index down to 1**;
  - pick `j = Math.floor(random() * (i + 1))`;
  - swap the elements at `i` and `j`.

```js
shuffle([1, 2, 3, 4]); // e.g. [3, 1, 4, 2]

const values = [0.5, 0.1, 0.9];
let k = 0;
shuffle([1, 2, 3, 4], () => values[k++]); // [4, 2, 1, 3]
```

**Constraints:** empty and single-element arrays come back as a copy without calling `random`. Tests shuffle `[1, 2, 3]` thousands of times and expect each of the 6 orders to appear about equally often.

## Notes

- **Approach:** `const result = array.slice()`, then the backwards loop above with a destructuring swap. The prefix `0..i` is the "unshuffled" pool; each step picks one of its `i + 1` elements uniformly and fixes it at position `i`.
- **Why `sort(() => Math.random() - 0.5)` is wrong:** the comparator is inconsistent, so the result depends on the engine's sorting algorithm and is **not** uniform. On 3 elements some orders show up far more often than others. It is also O(n log n).
- **Classic off-by-one:** `j = Math.floor(random() * n)` for every `i` (picking from the whole array) gives nⁿ equally likely paths onto n! permutations. Because nⁿ is not divisible by n!, the result is biased.
- **Complexity:** O(n) time, O(n) space for the copy.
- **Follow-ups:** an in-place variant, sampling k items without shuffling everything (a partial Fisher–Yates), and using `crypto.getRandomValues` when the shuffle must be unpredictable.
