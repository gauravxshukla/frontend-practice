/**
 * @param {string[]} tokens
 * @return {number}
 */
export default function evalRPN(tokens) {
  const stack = []; // operands waiting for an operator
  for (const token of tokens) {
    if (!['+', '-', '*', '/'].includes(token)) {
      stack.push(Number(token));
      continue;
    }
    // the right operand is on top, so pop it first
    const b = stack.pop();
    const a = stack.pop();
    if (token === '+') stack.push(a + b);
    else if (token === '-') stack.push(a - b);
    else if (token === '*') stack.push(a * b);
    // integer division truncates toward zero, not down
    else stack.push(Math.trunc(a / b));
  }
  return stack.pop();
}
