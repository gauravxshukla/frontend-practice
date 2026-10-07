/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
export default function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';

  const m = num1.length;
  const n = num2.length;
  const res = new Array(m + n).fill(0);

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // Digit product lands at positions i+j (carry) and i+j+1 (ones).
      const sum = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48) + res[i + j + 1];
      res[i + j + 1] = sum % 10;
      res[i + j] += Math.floor(sum / 10);
    }
  }

  // At most one leading zero (the product of an m- and n-digit number has m+n-1 or m+n digits).
  let start = 0;
  while (start < res.length - 1 && res[start] === 0) start++;
  return res.slice(start).join('');
}
