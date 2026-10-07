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

- **Stack:** push numbers. On an operator, pop `b` (the right operand) and then `a` (the left operand), and push `a op b`. The single remaining value is the answer.
- O(n) time and O(n) space.
- Pitfall: operand order. For `-` and `/` you need `a - b`, not `b - a`. The first pop is the *right* operand.
- Pitfall: `Math.floor` rounds negatives the wrong way (`Math.floor(-3.5)` is `-4`). Use `Math.trunc`, or `(a / b) | 0` for 32-bit values.
- Pitfall: detecting operators with `isNaN` or a character check breaks on negative numbers like `"-11"`. Compare against the exact operator strings.
- **Alternative:** recursion from the end of the array (the last token is the root operator). It's elegant but recurses as deep as the expression.
- Follow-up: convert infix to postfix with the shunting-yard algorithm, or evaluate infix directly (Basic Calculator).
