/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites [course, prerequisite] pairs
 * @return {number[]} a valid order, or [] if there's a cycle
 */
export default function findOrder(numCourses, prerequisites) {
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
  const order = [];
  while (ready.length) {
    const course = ready.pop();
    order.push(course); // every prerequisite of this course is already in the order
    for (const next of unlocks[course]) {
      if (--needs[next] === 0) ready.push(next);
    }
  }
  // a cycle leaves some courses out, and then no order exists
  return order.length === numCourses ? order : [];
}
