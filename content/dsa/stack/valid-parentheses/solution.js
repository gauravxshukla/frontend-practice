/**
 * @param {string} s
 * @return {boolean}
 */
export default function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }; // closer -> the opener it needs
  const stack = []; // openers still waiting to be closed
  for (const ch of s) {
    if (!(ch in pairs)) {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      // the latest unclosed opener must match (an empty stack fails too)
      return false;
    }
  }
  // anything left was opened but never closed
  return stack.length === 0;
}
