class Solution {
    private final List<List<Integer>> result = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();
    private int[] candidates;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        this.candidates = candidates;
        result.clear();
        dfs(0, target);
        return result;
    }

    private void dfs(int start, int remaining) {
        // the path adds up exactly to the target
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        // only candidates from start onwards, so each combination is built in one order
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) continue; // would overshoot
            path.add(candidates[i]);
            dfs(i, remaining - candidates[i]); // stay at i: the same number may repeat
            path.remove(path.size() - 1);
        }
    }
}
