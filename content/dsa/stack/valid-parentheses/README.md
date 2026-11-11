---
title: Valid Parentheses
type: dsa
difficulty: easy
topic: stack
order: 1
neetcode: true
tags: [stack, strings]
estimatedMinutes: 10
---

Given a string containing only `()[]{}`, return `true` if every opening bracket is closed by the same type of bracket, in the correct order.

```js
isValid('([]{})'); // true
isValid('([)]');   // false
isValid('((');     // false
isValid('');       // true
```

## Notes

- **Identify:** brackets must close in reverse order of opening → stack
- **Brute force:** repeatedly delete "()", "[]", "{}" until nothing changes, O(n²)
- **Insight:** the most recent unclosed opener is the only one a closer may match, so keep openers on a stack
- **Steps:** push openers; on a closer, the stack top must be its matching opener, else false; end with an empty stack
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** a closer on an empty stack ("]") and leftover openers ("((") are both invalid
- **Related:** Generate Parentheses, Valid Parenthesis String, Evaluate Reverse Polish Notation
