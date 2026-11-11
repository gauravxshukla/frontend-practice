/**
 * @param {number[]} numbers sorted ascending
 * @param {number} target
 * @return {number[]} 1-indexed positions
 */
export default function twoSum(numbers, target) {
  let l = 0;
  let r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    // found it; the problem wants 1-indexed positions
    if (sum === target) return [l + 1, r + 1];
    // too small: only a bigger left value can raise the sum
    if (sum < target) l++;
    // too big: only a smaller right value can lower it
    else r--;
  }
  return []; // unreachable: exactly one answer is guaranteed
}
