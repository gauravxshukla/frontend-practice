/**
 * Add a and b without using + or -.
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export default function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1; // bits that overflow into the next column
    a = a ^ b; // sum without carries
    b = carry;
  }
  return a;
}
