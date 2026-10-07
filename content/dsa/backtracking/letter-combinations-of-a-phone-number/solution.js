const KEYS = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz',
};

/**
 * @param {string} digits
 * @return {string[]}
 */
export default function letterCombinations(digits) {
  if (!digits) return [];
  const result = [];

  function backtrack(i, prefix) {
    if (i === digits.length) {
      result.push(prefix);
      return;
    }
    for (const ch of KEYS[digits[i]]) backtrack(i + 1, prefix + ch);
  }

  backtrack(0, '');
  return result;
}
