/**
 * @param {number[]} nums
 * @return {boolean}
 */
export default function containsDuplicate(nums) {
  const seen = new Set(); // values visited so far
  for (const num of nums) {
    // a second sighting is the duplicate, so stop early
    if (seen.has(num)) return true;
    seen.add(num);
  }
  // every value was new (also covers empty and single-element input)
  return false;
}
