class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        # nodes are 1-indexed, so slot 0 goes unused
        parent = list(range(len(edges) + 1))

        # root of x's set, pointing nodes closer to the root as we go (path halving)
        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b in edges:
            ra, rb = find(a), find(b)
            # already connected without this edge: it's the one that makes the cycle
            if ra == rb:
                return [a, b]
            parent[ra] = rb
        return []  # unreachable: the input always has one extra edge
