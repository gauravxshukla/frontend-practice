/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export default function getSum(a, b) {
  // JS bitwise operators work on 32-bit signed ints, just like the problem expects
  while (b !== 0) {
    // bits where both are 1 produce a carry into the next position
    const carry = (a & b) << 1;
    // XOR adds each bit position without the carry
    a = a ^ b;
    b = carry;
  }
  return a;
}
