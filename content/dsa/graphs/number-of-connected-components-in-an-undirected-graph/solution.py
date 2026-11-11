class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))

        # root of x's set, pointing nodes closer to the root as we go (path halving)
        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        components = n  # every node starts on its own
        for a, b in edges:
            ra, rb = find(a), find(b)
            # joining two different groups leaves one fewer; same group changes nothing
            if ra != rb:
                parent[ra] = rb
                components -= 1
        return components
