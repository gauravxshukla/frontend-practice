/**
 * @param {number[]} digits
 * @return {number[]}
 */
export default function plusOne(digits) {
  const out = [...digits];

  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i] < 9) {
      out[i]++;
      return out; // no carry left
    }
    out[i] = 0; // 9 + 1 = 10: write 0, carry 1
  }
  // Every digit was 9.
  return [1, ...out];
}
