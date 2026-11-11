/**
 * @param {string[][]} tickets [from, to] pairs
 * @return {string[]}
 */
export default function findItinerary(tickets) {
  // destinations per airport, sorted descending so pop() yields the smallest next
  const adj = new Map();
  for (const [from, to] of tickets) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }
  for (const list of adj.values()) list.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

  const route = [];
  const visit = (airport) => {
    const out = adj.get(airport) ?? [];
    // spend tickets smallest-first; each recursive call follows one ticket
    while (out.length) visit(out.pop());
    // no tickets left from here: it belongs at this point of the route (built backwards)
    route.push(airport);
  };
  visit('JFK');
  return route.reverse();
}
