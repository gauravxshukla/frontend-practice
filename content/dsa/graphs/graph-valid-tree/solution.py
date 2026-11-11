class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        # a tree on n nodes has exactly n - 1 edges; with that count, no cycle means connected
        if len(edges) != n - 1:
            return False
        parent = list(range(n))

        # root of x's set, pointing nodes closer to the root as we go (path halving)
        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b in edges:
            ra, rb = find(a), find(b)
            # already connected: this edge closes a cycle
            if ra == rb:
                return False
            parent[ra] = rb
        return True
