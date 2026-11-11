class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();
    private int[] nums;

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        // sorting puts equal values side by side and lets us stop early
        nums = candidates.clone();
        Arrays.sort(nums);
        result.clear();
        dfs(0, target);
        return result;
    }

    private void dfs(int start, int remaining) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length; i++) {
            // the same value at the same depth would rebuild combinations already found
            if (i > start && nums[i] == nums[i - 1]) continue;
            // sorted, so every later value overshoots too
            if (nums[i] > remaining) break;
            path.add(nums[i]);
            dfs(i + 1, remaining - nums[i]); // i + 1: each element is used at most once
            path.remove(path.size() - 1);
        }
    }
}
