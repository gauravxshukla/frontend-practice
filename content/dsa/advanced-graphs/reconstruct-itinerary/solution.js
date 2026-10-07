/**
 * @param {string[][]} tickets  [from, to] pairs; every ticket must be used exactly once
 * @return {string[]} the lexically smallest itinerary starting at "JFK"
 */
export default function findItinerary(tickets) {
  // Destinations per airport, sorted in reverse so pop() yields the smallest.
  const graph = new Map();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }
  for (const list of graph.values()) list.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

  // Hierholzer's algorithm: walk greedily; an airport is appended once it has no
  // tickets left, which builds the Eulerian path in reverse.
  const route = [];
  const stack = ['JFK'];
  while (stack.length) {
    const airport = stack[stack.length - 1];
    const out = graph.get(airport);
    if (out && out.length) stack.push(out.pop());
    else route.push(stack.pop());
  }
  return route.reverse();
}
