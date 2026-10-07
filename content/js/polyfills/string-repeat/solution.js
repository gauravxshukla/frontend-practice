/**
 * @param {number} count
 * @return {string}
 */
export default function myRepeat(count) {
  const str = String(this);
  // Truncate toward zero; NaN becomes 0.
  const n = Math.trunc(Number(count)) || 0;
  if (n < 0 || n === Infinity) {
    throw new RangeError(`Invalid count value: ${count}`);
  }

  let result = '';
  for (let i = 0; i < n; i++) {
    result += str;
  }
  return result;
}
