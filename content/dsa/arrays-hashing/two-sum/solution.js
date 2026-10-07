/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
export default function twoSum(numbers, target) {
  const seen = new Map();

  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(numbers[i], i);
  }
  return [];
}
