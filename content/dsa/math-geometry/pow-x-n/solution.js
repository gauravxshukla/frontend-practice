/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
export default function myPow(x, n) {
  // a negative power is the positive power of the reciprocal
  let base = n < 0 ? 1 / x : x;
  let exp = Math.abs(n);
  let result = 1;
  while (exp > 0) {
    // the lowest bit of exp is set: this power of base is part of the answer
    if (exp % 2 === 1) result *= base;
    // move to the next bit: base^(2k), half the exponent
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}
