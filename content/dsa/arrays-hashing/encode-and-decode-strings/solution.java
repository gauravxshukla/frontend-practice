class Codec {
    public String encode(List<String> strs) {
        StringBuilder out = new StringBuilder();
        // the length says where each string ends, so its content can contain anything
        for (String s : strs) out.append(s.length()).append('#').append(s);
        return out.toString();
    }

    public List<String> decode(String encoded) {
        List<String> result = new ArrayList<>();
        int i = 0;
        while (i < encoded.length()) {
            // the digits before '#' are the length of the next string
            int j = i;
            while (encoded.charAt(j) != '#') j++;
            int length = Integer.parseInt(encoded.substring(i, j));
            // take exactly that many characters, even if they include '#' or digits
            result.add(encoded.substring(j + 1, j + 1 + length));
            i = j + 1 + length;
        }
        return result;
    }
}
