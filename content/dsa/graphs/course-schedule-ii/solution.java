class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        // prerequisite -> courses it unlocks, and how many prerequisites each course still needs
        List<List<Integer>> unlocks = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) unlocks.add(new ArrayList<>());
        int[] needs = new int[numCourses];
        for (int[] p : prerequisites) {
            unlocks.get(p[1]).add(p[0]);
            needs[p[0]]++;
        }
        // courses with nothing left to wait for can be taken now
        Deque<Integer> ready = new ArrayDeque<>();
        for (int c = 0; c < numCourses; c++) if (needs[c] == 0) ready.push(c);
        int[] order = new int[numCourses];
        int taken = 0;
        while (!ready.isEmpty()) {
            int course = ready.pop();
            order[taken++] = course; // every prerequisite of this course is already in the order
            for (int next : unlocks.get(course)) {
                if (--needs[next] == 0) ready.push(next);
            }
        }
        // a cycle leaves some courses out, and then no order exists
        return taken == numCourses ? order : new int[0];
    }
}
