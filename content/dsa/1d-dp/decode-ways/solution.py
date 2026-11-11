class Solution:
    def numDecodings(self, s: str) -> int:
        # ways to decode the first i - 2 and i - 1 digits
        two_back = 1  # empty prefix: one way (decode nothing)
        one_back = 0 if s[0] == "0" else 1  # a leading zero can't be decoded
        for i in range(2, len(s) + 1):
            ways = 0
            # last digit on its own: any digit except 0
            if s[i - 1] != "0":
                ways += one_back
            # last two digits together: 10..26 (a leading 0 like "06" isn't allowed)
            pair = int(s[i - 2 : i])
            if 10 <= pair <= 26:
                ways += two_back
            two_back = one_back
            one_back = ways
        return one_back
