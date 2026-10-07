const MAX = 2 ** 31 - 1; //  2147483647
const MIN = -(2 ** 31); // -2147483648

/**
 * @param {number} x
 * @return {number}
 */
export default function reverse(x) {
  let rev = 0;
  while (x !== 0) {
    const digit = x % 10; // keeps x's sign
    x = Math.trunc(x / 10);

    // Would rev * 10 + digit leave the 32-bit range?
    if (rev > Math.trunc(MAX / 10) || (rev === Math.trunc(MAX / 10) && digit > 7)) return 0;
    if (rev < Math.trunc(MIN / 10) || (rev === Math.trunc(MIN / 10) && digit < -8)) return 0;

    rev = rev * 10 + digit;
  }
  return rev;
}
