/**
 * @param {string} s
 * @return {number[]}
 */
export default function partitionLabels(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);

  const sizes = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i])); // piece must reach this letter's last occurrence
    if (i === end) {
      sizes.push(end - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}
