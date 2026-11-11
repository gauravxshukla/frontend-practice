/**
 * @param {string} digits each in '2'..'9'
 * @return {string[]}
 */
export default function letterCombinations(digits) {
  // no digits means no combinations at all (not one empty string)
  if (!digits) return [];
  const letters = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };
  const result = [];
  const dfs = (i, path) => {
    // one letter chosen for every digit
    if (i === digits.length) {
      result.push(path);
      return;
    }
    // each letter on this digit's key starts its own branch
    for (const ch of letters[digits[i]]) dfs(i + 1, path + ch);
  };
  dfs(0, '');
  return result;
}
