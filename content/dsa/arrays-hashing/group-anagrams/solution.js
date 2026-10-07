/**
 * @param {string[]} strs
 * @return {string[][]}
 */
export default function groupAnagrams(strs) {
  const groups = new Map();

  for (const word of strs) {
    // Signature = letter counts a..z, so anagrams share a key without sorting.
    const counts = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) counts[word.charCodeAt(i) - 97]++;
    const key = counts.join(',');

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
