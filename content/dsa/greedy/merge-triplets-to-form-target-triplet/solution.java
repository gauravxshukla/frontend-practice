class Solution {
    public boolean mergeTriplets(int[][] triplets, int[] target) {
        boolean[] found = new boolean[3]; // which target positions some safe triplet matches
        for (int[] t : triplets) {
            // merging takes the max, so any value above the target can never be undone
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
            for (int i = 0; i < 3; i++) if (t[i] == target[i]) found[i] = true;
        }
        return found[0] && found[1] && found[2];
    }
}
