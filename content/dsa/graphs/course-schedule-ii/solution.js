/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites  [course, prereq] pairs: take prereq before course
 * @return {number[]} a valid order of all courses, or [] if none exists
 */
export default function findOrder(numCourses, prerequisites) {
  const indegree = new Array(numCourses).fill(0);
  const unlocks = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    unlocks[prereq].push(course);
    indegree[course]++;
  }

  // Kahn's algorithm; the queue itself is the topological order.
  const order = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) order.push(i);
  for (let head = 0; head < order.length; head++) {
    for (const next of unlocks[order[head]]) {
      if (--indegree[next] === 0) order.push(next);
    }
  }
  return order.length === numCourses ? order : [];
}
