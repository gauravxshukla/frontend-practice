class Codec {
    // Length-prefix each string so any character (including '#') round-trips.
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) sb.append(s.length()).append('#').append(s);
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = s.indexOf('#', i);
            int length = Integer.parseInt(s.substring(i, j));
            out.add(s.substring(j + 1, j + 1 + length));
            i = j + 1 + length;
        }
        return out;
    }
}
