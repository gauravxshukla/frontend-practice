/**
 * @param {number} n unsigned 32-bit integer
 * @return {number}
 */
export default function hammingWeight(n) {
  let count = 0;
  // JS bitwise operators work on the same 32 bits, so values >= 2^31 still clear correctly
  while (n !== 0) {
    // n & (n - 1) clears the lowest set bit: one iteration per 1 bit
    n &= n - 1;
    count++;
  }
  return count;
}
