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

- **Key insight:** the minimum only changes on push and pop, and a stack undoes changes in reverse order. So remember the minimum *at each height*.
- **Pair stack (reference):** push `[val, min(val, currentMin)]`. `getMin` reads the top pair's second field, and popping automatically restores the previous minimum.
- **Two stacks:** a main stack plus a min stack that you push to only when `val ≤ currentMin`, and pop from when the popped value equals its top. This saves space when the minimum rarely changes.
- O(1) for every operation and O(n) space.
- Pitfall (two-stack version): use `≤`, not `<`, when pushing to the min stack. Otherwise duplicates of the minimum are lost on the first pop.
- Pitfall: scanning the whole stack in `getMin` is O(n) and breaks the requirement.
- Follow-up: O(1) *extra* space using a single stack of differences from the current min (store `val − min` and decode on pop). Watch for overflow in fixed-width languages.
