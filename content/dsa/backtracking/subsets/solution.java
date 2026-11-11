class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>(); // the subset being built
    private int[] nums;

    public List<List<Integer>> subsets(int[] nums) {
        this.nums = nums;
        result.clear();
        dfs(0);
        return result;
    }

    private void dfs(int i) {
        // every element has been decided: record this subset (as a copy)
        if (i == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        // choice 1: include nums[i]
        path.add(nums[i]);
        dfs(i + 1);
        path.remove(path.size() - 1); // undo before the other choice
        // choice 2: skip nums[i]
        dfs(i + 1);
    }
}
