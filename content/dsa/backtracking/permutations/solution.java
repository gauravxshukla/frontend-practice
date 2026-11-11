class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();
    private boolean[] used; // which numbers are on the current path
    private int[] nums;

    public List<List<Integer>> permute(int[] nums) {
        this.nums = nums;
        used = new boolean[nums.length];
        result.clear();
        dfs();
        return result;
    }

    private void dfs() {
        // every position is filled
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            // place nums[i] next, explore, then free it for other branches
            used[i] = true;
            path.add(nums[i]);
            dfs();
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
