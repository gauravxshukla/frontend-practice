/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites [course, prerequisite] pairs
 * @return {boolean}
 */
export default function canFinish(numCourses, prerequisites) {
  // prerequisite -> courses it unlocks, and how many prerequisites each course still needs
  const unlocks = Array.from({ length: numCourses }, () => []);
  const needs = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    unlocks[pre].push(course);
    needs[course]++;
  }
  // courses with nothing left to wait for can be taken now
  const ready = [];
  for (let c = 0; c < numCourses; c++) if (needs[c] === 0) ready.push(c);
  let taken = 0;
  while (ready.length) {
    const course = ready.pop();
    taken++;
    // taking it removes one requirement from each course it unlocks
    for (const next of unlocks[course]) {
      if (--needs[next] === 0) ready.push(next);
    }
  }
  // courses on a cycle never reach zero requirements
  return taken === numCourses;
}
