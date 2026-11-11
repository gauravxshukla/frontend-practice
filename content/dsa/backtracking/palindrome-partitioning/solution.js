/**
 * @param {string} s
 * @return {string[][]}
 */
export default function partition(s) {
  // two pointers moving inward check s[l..r]
  const isPalindrome = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }
    return true;
  };
  const result = [];
  const path = [];
  const dfs = (start) => {
    // the whole string is cut into palindromes
    if (start === s.length) {
      result.push([...path]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      // only a palindromic piece can be cut off, which prunes everything else early
      if (!isPalindrome(start, end)) continue;
      path.push(s.slice(start, end + 1));
      dfs(end + 1);
      path.pop();
    }
  };
  dfs(0);
  return result;
}
