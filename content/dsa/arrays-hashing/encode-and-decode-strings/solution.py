class Codec:
    def encode(self, strs: List[str]) -> str:
        out = []
        # the length says where each string ends, so its content can contain anything
        for s in strs:
            out.append(str(len(s)) + "#" + s)
        return "".join(out)

    def decode(self, encoded: str) -> List[str]:
        result = []
        i = 0
        while i < len(encoded):
            # the digits before '#' are the length of the next string
            j = i
            while encoded[j] != "#":
                j += 1
            length = int(encoded[i:j])
            # take exactly that many characters, even if they include '#' or digits
            result.append(encoded[j + 1 : j + 1 + length])
            i = j + 1 + length
        return result
