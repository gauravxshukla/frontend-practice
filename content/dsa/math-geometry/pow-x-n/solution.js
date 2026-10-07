/**
 * Iterative fast exponentiation (binary exponentiation).
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
export default function myPow(x, n) {
  if (n < 0) {
    x = 1 / x;
    n = -n; // safe in JS: numbers are doubles, so 2^31 fits
  }

  let result = 1;
  while (n > 0) {
    if (n % 2 === 1) result *= x; // odd exponent: take one x out
    x *= x;
    n = Math.floor(n / 2); // not n >> 1, which breaks at 2^31
  }
  return result;
}
