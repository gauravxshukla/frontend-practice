/**
 * @param {number} n
 * @return {number[]} set-bit counts of 0..n
 */
export default function countBits(n) {
  const bits = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // i >> 1 is i without its last bit (already counted); add that last bit back
    bits[i] = bits[i >> 1] + (i & 1);
  }
  return bits;
}
