// Accepts any valid topological order, or [] exactly when no order exists.
// Works from the raw input only; it never looks at the expected answer.
export default function check(input, output) {
  const [numCourses, prerequisites] = input;
  if (!Array.isArray(output)) return false;

  // Independently decide whether an order exists (DFS three-colour cycle check).
  const unlocks = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) unlocks[prereq].push(course);
  const state = new Array(numCourses).fill(0); // 0 new, 1 on stack, 2 done
  let hasCycle = false;
  for (let s = 0; s < numCourses && !hasCycle; s++) {
    if (state[s]) continue;
    const stack = [[s, 0]];
    state[s] = 1;
    while (stack.length && !hasCycle) {
      const top = stack[stack.length - 1];
      const [node, idx] = top;
      if (idx < unlocks[node].length) {
        top[1]++;
        const next = unlocks[node][idx];
        if (state[next] === 1) hasCycle = true;
        else if (state[next] === 0) {
          state[next] = 1;
          stack.push([next, 0]);
        }
      } else {
        state[node] = 2;
        stack.pop();
      }
    }
  }

  if (hasCycle) return output.length === 0;

  // Must be a permutation of 0..numCourses-1 ...
  if (output.length !== numCourses) return false;
  const position = new Map();
  for (let i = 0; i < output.length; i++) {
    const c = output[i];
    if (!Number.isInteger(c) || c < 0 || c >= numCourses || position.has(c)) return false;
    position.set(c, i);
  }
  // ... in which every prerequisite comes before its course.
  return prerequisites.every(([course, prereq]) => position.get(prereq) < position.get(course));
}
