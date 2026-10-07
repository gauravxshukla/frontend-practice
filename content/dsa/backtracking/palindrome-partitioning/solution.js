/**
 * @param {string} s
 * @return {string[][]}
 */
export default function partition(s) {
  const n = s.length;
  // isPal[i][j]: s.slice(i, j + 1) is a palindrome. Filled from short to long.
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    }
  }

  const result = [];
  const path = [];

  function backtrack(start) {
    if (start === n) {
      result.push([...path]);
      return;
    }
    for (let end = start; end < n; end++) {
      if (!isPal[start][end]) continue;
      path.push(s.slice(start, end + 1));
      backtrack(end + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}
