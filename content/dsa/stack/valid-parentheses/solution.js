/**
 * @param {string} str
 * @return {boolean}
 */
export default function isValid(str) {
  const currentStack = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const top = currentStack[currentStack.length - 1];

    if (char === '(' || char === '[' || char === '{') {
      currentStack.push(char);
    } else if (
      (char === ')' && top === '(') ||
      (char === ']' && top === '[') ||
      (char === '}' && top === '{')
    ) {
      currentStack.pop();
    } else {
      return false;
    }
  }
  return currentStack.length === 0;
}
