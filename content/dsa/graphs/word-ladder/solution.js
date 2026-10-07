/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number} words in the shortest transformation sequence, or 0
 */
export default function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;

  // Bucket words by wildcard pattern: "hot" -> "*ot", "h*t", "ho*".
  const buckets = new Map();
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const pattern = word.slice(0, i) + '*' + word.slice(i + 1);
      if (!buckets.has(pattern)) buckets.set(pattern, []);
      buckets.get(pattern).push(word);
    }
  }

  // Plain BFS; the level counts words in the sequence, including beginWord.
  const visited = new Set([beginWord]);
  let frontier = [beginWord];
  let length = 1;
  while (frontier.length) {
    length++;
    const next = [];
    for (const word of frontier) {
      for (let i = 0; i < word.length; i++) {
        const pattern = word.slice(0, i) + '*' + word.slice(i + 1);
        for (const candidate of buckets.get(pattern) ?? []) {
          if (visited.has(candidate)) continue;
          if (candidate === endWord) return length;
          visited.add(candidate);
          next.push(candidate);
        }
        buckets.delete(pattern); // every word in this bucket is now visited
      }
    }
    frontier = next;
  }
  return 0;
}
