/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites  [course, prereq] pairs: take prereq before course
 * @return {boolean}
 */
export default function canFinish(numCourses, prerequisites) {
  // Kahn's algorithm: repeatedly take a course with no remaining prerequisites.
  const indegree = new Array(numCourses).fill(0);
  const unlocks = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    unlocks[prereq].push(course);
    indegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);

  let taken = 0;
  for (let head = 0; head < queue.length; head++) {
    taken++;
    for (const next of unlocks[queue[head]]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  // Anything left over sits on (or behind) a cycle.
  return taken === numCourses;
}
