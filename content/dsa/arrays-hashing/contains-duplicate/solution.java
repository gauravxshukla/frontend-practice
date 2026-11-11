class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>(); // values visited so far
        for (int num : nums) {
            // a second sighting is the duplicate, so stop early
            if (seen.contains(num)) return true;
            seen.add(num);
        }
        // every value was new (also covers empty and single-element input)
        return false;
    }
}
