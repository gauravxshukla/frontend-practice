/**
 * @param {number[]} numbers sorted in non-decreasing order
 * @param {number} target
 * @return {number[]} 1-based indices [i, j] with i < j
 */
export default function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    // Too small: only moving left up can grow the sum. Too big: move right down.
    if (sum < target) left++;
    else right--;
  }
  return [];
}
