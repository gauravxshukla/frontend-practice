/**
 * @param {number} n - an unsigned 32-bit integer
 * @return {number} an unsigned 32-bit integer
 */
export default function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1); // append n's lowest bit
    n >>>= 1;
  }
  return result >>> 0; // reinterpret the 32-bit pattern as unsigned
}
