class Codec:
    def encode(self, strs: List[str]) -> str:
        # Length-prefix each string so any character (including '#') round-trips.
        return "".join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s: str) -> List[str]:
        out, i = [], 0
        while i < len(s):
            j = s.index("#", i)
            length = int(s[i:j])
            out.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length
        return out
