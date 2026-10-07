const OPS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => Math.trunc(a / b), // division truncates toward zero
};

/**
 * @param {string[]} tokens
 * @return {number}
 */
export default function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token in OPS) {
      const b = stack.pop(); // right operand is on top
      const a = stack.pop();
      stack.push(OPS[token](a, b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop();
}
