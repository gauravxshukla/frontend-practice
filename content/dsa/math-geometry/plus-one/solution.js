/**
 * @param {number[]} digits most significant first
 * @return {number[]}
 */
export default function plusOne(digits) {
  const result = [...digits];
  for (let i = result.length - 1; i >= 0; i--) {
    // no carry past a digit below 9, so we're done
    if (result[i] < 9) {
      result[i]++;
      return result;
    }
    // 9 + 1 = 10: write 0 and carry left
    result[i] = 0;
  }
  // every digit was 9, so the number gains a leading 1
  return [1, ...result];
}
