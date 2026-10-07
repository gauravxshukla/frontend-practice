/**
 * @param {number} n - an unsigned 32-bit integer
 * @return {number}
 */
export default function hammingWeight(n) {
  let count = 0;
  n >>>= 0;
  while (n !== 0) {
    n = (n & (n - 1)) >>> 0; // clear the lowest set bit
    count++;
  }
  return count;
}
