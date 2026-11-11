class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> index of numbers visited so far
        for (int i = 0; i < nums.length; i++) {
            // if the partner was seen earlier, we have the pair
            if (seen.containsKey(target - nums[i])) return new int[] {seen.get(target - nums[i]), i};
            // store after checking so a number never pairs with itself
            seen.put(nums[i], i);
        }
        return new int[0]; // unreachable: exactly one answer is guaranteed
    }
}
