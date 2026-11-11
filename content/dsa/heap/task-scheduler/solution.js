/**
 * @param {string[]} tasks
 * @param {number} n cooldown between two runs of the same task
 * @return {number}
 */
export default function leastInterval(tasks, n) {
  const counts = new Array(26).fill(0);
  for (const t of tasks) counts[t.charCodeAt(0) - 65]++;
  const maxCount = Math.max(...counts);
  // tasks tied for the highest count all sit in the final row
  const withMax = counts.filter((c) => c === maxCount).length;
  // (maxCount - 1) full frames of n + 1 slots, then one last row of the busiest tasks
  const framed = (maxCount - 1) * (n + 1) + withMax;
  // if other tasks overflow the gaps, no idling is needed at all
  return Math.max(tasks.length, framed);
}
