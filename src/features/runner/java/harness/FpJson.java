import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Minimal JSON for the DSA harness (no library on CheerpJ's classpath).
 * Parses to null / Boolean / Long / Double / String / List / Map and writes the same back.
 */
final class FpJson {
  private final String s;
  private int i;

  private FpJson(String s) {
    this.s = s;
  }

  static Object parse(String text) {
    FpJson p = new FpJson(text);
    Object v = p.value();
    p.ws();
    if (p.i != text.length()) throw new IllegalArgumentException("Trailing JSON at " + p.i);
    return v;
  }

  private void ws() {
    while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++;
  }

  private void expect(char c) {
    ws();
    if (s.charAt(i) != c) throw new IllegalArgumentException("Expected '" + c + "' at " + i);
    i++;
  }

  private Object value() {
    ws();
    char c = s.charAt(i);
    switch (c) {
      case '{':
        return object();
      case '[':
        return array();
      case '"':
        return string();
      case 't':
        i += 4;
        return Boolean.TRUE;
      case 'f':
        i += 5;
        return Boolean.FALSE;
      case 'n':
        i += 4;
        return null;
      default:
        return number();
    }
  }

  private Map<String, Object> object() {
    Map<String, Object> m = new LinkedHashMap<>();
    expect('{');
    ws();
    if (s.charAt(i) == '}') {
      i++;
      return m;
    }
    while (true) {
      ws();
      String key = string();
      expect(':');
      m.put(key, value());
      ws();
      if (s.charAt(i++) == '}') return m;
    }
  }

  private List<Object> array() {
    List<Object> a = new ArrayList<>();
    expect('[');
    ws();
    if (s.charAt(i) == ']') {
      i++;
      return a;
    }
    while (true) {
      a.add(value());
      ws();
      if (s.charAt(i++) == ']') return a;
    }
  }

  private String string() {
    expect('"');
    StringBuilder b = new StringBuilder();
    while (true) {
      char c = s.charAt(i++);
      if (c == '"') return b.toString();
      if (c != '\\') {
        b.append(c);
        continue;
      }
      char e = s.charAt(i++);
      switch (e) {
        case 'n': b.append('\n'); break;
        case 't': b.append('\t'); break;
        case 'r': b.append('\r'); break;
        case 'b': b.append('\b'); break;
        case 'f': b.append('\f'); break;
        case 'u':
          b.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
          i += 4;
          break;
        default: b.append(e);
      }
    }
  }

  private Number number() {
    int start = i;
    while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
    String t = s.substring(start, i);
    if (t.indexOf('.') >= 0 || t.indexOf('e') >= 0 || t.indexOf('E') >= 0) return Double.parseDouble(t);
    return Long.parseLong(t);
  }

  static String write(Object v) {
    StringBuilder b = new StringBuilder();
    write(v, b);
    return b.toString();
  }

  private static void write(Object v, StringBuilder b) {
    if (v == null) {
      b.append("null");
    } else if (v instanceof String) {
      quote((String) v, b);
    } else if (v instanceof Boolean) {
      b.append(v);
    } else if (v instanceof Double || v instanceof Float) {
      double d = ((Number) v).doubleValue();
      if (Double.isNaN(d) || Double.isInfinite(d)) throw new IllegalArgumentException("Output " + d + " isn't a finite number");
      b.append(d == Math.rint(d) && Math.abs(d) < 1e15 ? String.valueOf((long) d) : String.valueOf(d));
    } else if (v instanceof Number) {
      b.append(v);
    } else if (v instanceof Map) {
      b.append('{');
      boolean first = true;
      for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) {
        if (!first) b.append(',');
        first = false;
        quote(String.valueOf(e.getKey()), b);
        b.append(':');
        write(e.getValue(), b);
      }
      b.append('}');
    } else if (v instanceof List) {
      b.append('[');
      boolean first = true;
      for (Object x : (List<?>) v) {
        if (!first) b.append(',');
        first = false;
        write(x, b);
      }
      b.append(']');
    } else {
      throw new IllegalArgumentException("Can't serialize " + v.getClass().getName());
    }
  }

  private static void quote(String s, StringBuilder b) {
    b.append('"');
    for (int k = 0; k < s.length(); k++) {
      char c = s.charAt(k);
      switch (c) {
        case '"': b.append("\\\""); break;
        case '\\': b.append("\\\\"); break;
        case '\n': b.append("\\n"); break;
        case '\r': b.append("\\r"); break;
        case '\t': b.append("\\t"); break;
        default:
          if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
          else b.append(c);
      }
    }
    b.append('"');
  }
}
