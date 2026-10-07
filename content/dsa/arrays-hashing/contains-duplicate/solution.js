/**
 * @param {number[]} numbers
 * @return {boolean}
 */
export default function containsDuplicate(numbers) {
  const seen = new Set();

  for (const n of numbers) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
