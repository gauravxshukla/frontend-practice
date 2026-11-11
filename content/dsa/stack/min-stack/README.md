---
title: Min Stack
type: dsa
difficulty: medium
topic: stack
order: 2
neetcode: true
tags: [stack, design]
estimatedMinutes: 15
---

Design a `MinStack` class that works like a normal stack but can also report its smallest element. **Every** operation must run in O(1) time.

- `new MinStack()` creates an empty stack.
- `push(val)` puts `val` on top.
- `pop()` removes the top element and returns nothing.
- `top()` returns the top element.
- `getMin()` returns the smallest element currently in the stack.

`pop`, `top`, and `getMin` are only called when the stack is non-empty.

```js
class MinStack {
  constructor()
  push(val)  // → void
  pop()      // → void
  top()      // → number
  getMin()   // → number
}
```

## Examples

The grader replays a list of operations and their arguments, then compares each return value (`null` for the constructor and for methods that return nothing).

```text
Input:  ["MinStack","push","push","push","getMin","pop","top","getMin"]
        [[],[1],[2],[0],[],[],[],[]]
Output: [null,null,null,null,0,null,2,1]

Input:  ["MinStack","push","push","push","getMin","pop","top","getMin"]
        [[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
```

## Constraints

- −2³¹ ≤ `val` ≤ 2³¹ − 1
- At most 3 · 10⁴ calls in total.

## Notes

- **Identify:** stack with O(1) getMin → store the running minimum alongside each element
- **Brute force:** scan the whole stack on every getMin, O(n) per call
- **Insight:** instead of recomputing the min, remember the min at each height; popping restores the old one
- **Steps:** push (val, min(val, current min)); pop removes the pair; top and getMin read the top pair
- **Complexity:** getMin O(n) → O(1); every operation O(1) time, O(n) space
- **Pitfall:** the first push has no current min, so its min is the value itself
- **Related:** Valid Parentheses, Evaluate Reverse Polish Notation, Daily Temperatures
