class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();
    private int[] nums;

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        // sorting puts equal values side by side so repeats are easy to skip
        this.nums = nums.clone();
        Arrays.sort(this.nums);
        result.clear();
        dfs(0);
        return result;
    }

    private void dfs(int start) {
        // every path, including the empty one, is a subset
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            // the same value at the same depth would build the same subsets again
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.add(nums[i]);
            dfs(i + 1);
            path.remove(path.size() - 1);
        }
    }
}
