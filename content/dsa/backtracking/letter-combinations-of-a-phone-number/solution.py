class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        # no digits means no combinations at all (not one empty string)
        if not digits:
            return []
        letters = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        result = []

        def dfs(i: int, path: str) -> None:
            # one letter chosen for every digit
            if i == len(digits):
                result.append(path)
                return
            # each letter on this digit's key starts its own branch
            for ch in letters[digits[i]]:
                dfs(i + 1, path + ch)

        dfs(0, "")
        return result
