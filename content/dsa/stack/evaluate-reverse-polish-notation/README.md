---
title: Evaluate Reverse Polish Notation
type: dsa
difficulty: medium
topic: stack
order: 3
neetcode: true
tags: [stack, math, arrays]
estimatedMinutes: 15
---

You get an arithmetic expression in **Reverse Polish (postfix) notation** as an array of string tokens. Each token is either an integer or one of `+`, `-`, `*`, `/`, and an operator applies to the two values just before it. Evaluate the expression and return the result.

- Division between integers **truncates toward zero** (`7 / -2` is `-3`).
- The expression is always valid, and there is no division by zero.

```js
function evalRPN(tokens) // → number
```

## Examples

```text
Input:  tokens = ["1","2","+","3","*","4","-"]
Output: 5
Explanation: ((1 + 2) * 3) - 4 = 5

Input:  tokens = ["4","13","5","/","+"]
Output: 6
Explanation: 4 + (13 / 5) = 4 + 2 = 6

Input:  tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
```

## Constraints

- 1 ≤ `tokens.length` ≤ 10⁴
- Each token is an operator or an integer in the range [−200, 200].
- Every intermediate result fits in a 32-bit integer.

## Notes

- **Identify:** postfix expression, operators follow their operands → stack of numbers
- **Brute force:** repeatedly find the first operator, evaluate it with the two tokens before it, splice, O(n²)
- **Insight:** an operator always applies to the two most recent values, so a stack gives them in O(1)
- **Steps:** push numbers; on an operator pop b then a, push a op b; the last value is the answer
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** pop order matters for − and ÷, and division truncates toward zero (−7 / 2 = −3)
- **Related:** Valid Parentheses, Min Stack, Daily Temperatures
