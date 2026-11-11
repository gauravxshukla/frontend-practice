class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        # the cards must split into whole groups
        if len(hand) % groupSize != 0:
            return False
        count = {}
        for card in hand:
            count[card] = count.get(card, 0) + 1
        for card in sorted(hand):
            # already used by an earlier run
            if count[card] == 0:
                continue
            # the smallest card left can only be the start of a run, so build it now
            for v in range(card, card + groupSize):
                if count.get(v, 0) == 0:
                    return False
                count[v] -= 1
        return True
