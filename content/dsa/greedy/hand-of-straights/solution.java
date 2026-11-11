class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        // the cards must split into whole groups
        if (hand.length % groupSize != 0) return false;
        Map<Integer, Integer> count = new HashMap<>();
        for (int card : hand) count.put(card, count.getOrDefault(card, 0) + 1);
        int[] sorted = hand.clone();
        Arrays.sort(sorted);
        for (int card : sorted) {
            // already used by an earlier run
            if (count.get(card) == 0) continue;
            // the smallest card left can only be the start of a run, so build it now
            for (int v = card; v < card + groupSize; v++) {
                if (count.getOrDefault(v, 0) == 0) return false;
                count.put(v, count.get(v) - 1);
            }
        }
        return true;
    }
}
