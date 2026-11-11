/**
 * @param {string[]} strs
 * @return {string[][]}
 */
export default function groupAnagrams(strs) {
  const groups = new Map(); // signature -> words with that signature
  for (const word of strs) {
    // anagrams have identical letter counts, so the counts identify the group
    const counts = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) counts[word.charCodeAt(i) - 97]++;
    // the separator keeps counts like [1, 11] and [11, 1] from colliding
    const key = counts.join('#');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
