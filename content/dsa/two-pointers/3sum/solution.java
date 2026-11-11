class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // sorting lets pointers steer the sum and puts duplicates side by side
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < sorted.length - 2; i++) {
            // the same first value would only repeat triplets already found
            if (i > 0 && sorted[i] == sorted[i - 1]) continue;
            // a positive smallest value can't reach a sum of 0
            if (sorted[i] > 0) break;
            int l = i + 1;
            int r = sorted.length - 1;
            while (l < r) {
                int sum = sorted[i] + sorted[l] + sorted[r];
                if (sum < 0) l++; // need a bigger total
                else if (sum > 0) r--; // need a smaller total
                else {
                    result.add(Arrays.asList(sorted[i], sorted[l], sorted[r]));
                    l++;
                    r--;
                    // step past equal values so this triplet isn't added again
                    while (l < r && sorted[l] == sorted[l - 1]) l++;
                    while (l < r && sorted[r] == sorted[r + 1]) r--;
                }
            }
        }
        return result;
    }
}
