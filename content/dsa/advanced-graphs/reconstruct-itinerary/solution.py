class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        # destinations per airport, sorted descending so pop() yields the smallest next
        adj = {}
        for frm, to in tickets:
            adj.setdefault(frm, []).append(to)
        for lst in adj.values():
            lst.sort(reverse=True)

        route = []

        def visit(airport: str) -> None:
            out = adj.get(airport, [])
            # spend tickets smallest-first; each recursive call follows one ticket
            while out:
                visit(out.pop())
            # no tickets left from here: it belongs at this point of the route (built backwards)
            route.append(airport)

        visit("JFK")
        return route[::-1]
