/**
 * @param {number} n unsigned 32-bit integer
 * @return {number} unsigned 32-bit integer
 */
export default function reverseBits(n) {
  let result = 0;
  // all 32 positions, because leading zeros become trailing ones' places
  for (let i = 0; i < 32; i++) {
    // move n's lowest bit onto the right end of result
    result = (result << 1) | (n & 1);
    n >>>= 1; // unsigned shift: never drag a sign bit in
  }
  // JS bitwise results are signed; >>> 0 reads them back as unsigned
  return result >>> 0;
}
