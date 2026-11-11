/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number} words in the shortest sequence, or 0
 */
export default function ladderLength(beginWord, endWord, wordList) {
  const unused = new Set(wordList); // dictionary words not reached yet
  if (!unused.has(endWord)) return 0;
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let level = [beginWord];
  let length = 1; // beginWord counts as the first word
  // BFS: every word in round k is k changes from beginWord, so the first hit is shortest
  while (level.length) {
    const next = [];
    for (const word of level) {
      if (word === endWord) return length;
      // neighbours differ in one position; generate them instead of comparing pairs
      for (let i = 0; i < word.length; i++) {
        for (const ch of letters) {
          const candidate = word.slice(0, i) + ch + word.slice(i + 1);
          if (unused.has(candidate)) {
            unused.delete(candidate); // queued once is enough
            next.push(candidate);
          }
        }
      }
    }
    level = next;
    length++;
  }
  return 0;
}
