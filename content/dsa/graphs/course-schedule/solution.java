class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
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
        int taken = 0;
        while (!ready.isEmpty()) {
            int course = ready.pop();
            taken++;
            // taking it removes one requirement from each course it unlocks
            for (int next : unlocks.get(course)) {
                if (--needs[next] == 0) ready.push(next);
            }
        }
        // courses on a cycle never reach zero requirements
        return taken == numCourses;
    }
}
