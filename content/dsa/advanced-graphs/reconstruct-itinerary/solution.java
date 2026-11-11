class Solution {
    private final Map<String, List<String>> adj = new HashMap<>();
    private final LinkedList<String> route = new LinkedList<>();

    public List<String> findItinerary(List<List<String>> tickets) {
        adj.clear();
        route.clear();
        for (List<String> t : tickets) adj.computeIfAbsent(t.get(0), k -> new ArrayList<>()).add(t.get(1));
        // destinations per airport, sorted descending so removing the last yields the smallest next
        for (List<String> list : adj.values()) list.sort(Collections.reverseOrder());
        visit("JFK");
        return route;
    }

    private void visit(String airport) {
        List<String> out = adj.getOrDefault(airport, new ArrayList<>());
        // spend tickets smallest-first; each recursive call follows one ticket
        while (!out.isEmpty()) visit(out.remove(out.size() - 1));
        // no tickets left from here: it belongs at this point of the route (built backwards)
        route.addFirst(airport);
    }
}
