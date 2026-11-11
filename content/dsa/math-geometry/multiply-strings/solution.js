/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
export default function multiply(num1, num2) {
  const m = num1.length;
  const n = num2.length;
  // the product has at most m + n digits
  const out = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // digits i and j contribute to positions i + j (carry) and i + j + 1 (units)
      const sum = Number(num1[i]) * Number(num2[j]) + out[i + j + 1];
      out[i + j + 1] = sum % 10;
      out[i + j] += Math.floor(sum / 10);
    }
  }
  // drop leading zeros, but keep one digit so 0 stays "0"
  let start = 0;
  while (start < out.length - 1 && out[start] === 0) start++;
  return out.slice(start).join('');
}
