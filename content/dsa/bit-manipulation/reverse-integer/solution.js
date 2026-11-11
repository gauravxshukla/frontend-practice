/**
 * @param {number} x 32-bit signed integer
 * @return {number} x with its digits reversed, or 0 if that overflows
 */
export default function reverse(x) {
  const sign = x < 0 ? -1 : 1;
  let rest = Math.abs(x);
  // largest magnitude allowed: 2^31 - 1 for positives, 2^31 for negatives
  const limit = sign > 0 ? 2147483647 : 2147483648;
  let rev = 0;
  while (rest > 0) {
    const digit = rest % 10;
    rest = Math.floor(rest / 10);
    // rev * 10 + digit would pass the limit: report overflow before it happens
    if (rev > Math.floor((limit - digit) / 10)) return 0;
    rev = rev * 10 + digit;
  }
  return sign * rev;
}
