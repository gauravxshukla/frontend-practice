import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.GenericArrayType;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.lang.reflect.WildcardType;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Deque;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

/**
 * JSON case values <-> Java values, mirroring src/features/runner/core.js.
 * Plain values follow the parameter's real (generic) type, read by reflection,
 * so `int[]`, `List<List<Integer>>`, `long` or `char[][]` all work. Node types
 * (ListNode, TreeNode, Node) are reached by name and reflection only, so the
 * harness compiles once and the user may bring their own node classes.
 */
final class FpConvert {
  private FpConvert() {}

  /* ------------------------------------------------------------ reflection */

  static Field field(Class<?> c, String name) {
    for (Class<?> k = c; k != null; k = k.getSuperclass()) {
      try {
        Field f = k.getDeclaredField(name);
        f.setAccessible(true);
        return f;
      } catch (NoSuchFieldException ignored) {
        // keep looking in superclasses
      }
    }
    throw new IllegalStateException(c.getSimpleName() + " has no field `" + name + "`");
  }

  static Object get(Object node, String name) throws IllegalAccessException {
    return field(node.getClass(), name).get(node);
  }

  static void set(Object node, String name, Object value) throws IllegalAccessException {
    Field f = field(node.getClass(), name);
    f.set(node, value == null ? null : toJava(value, f.getGenericType()));
  }

  /** A node with `val` set: via a one-argument constructor (Node(int val)) or a no-arg one. */
  static Object node(String className, Object val) throws Exception {
    Class<?> c = Class.forName(className);
    for (Constructor<?> k : c.getDeclaredConstructors()) {
      if (k.getParameterCount() == 1 && k.getParameterTypes()[0] != c) {
        k.setAccessible(true);
        return k.newInstance(toJava(val, k.getGenericParameterTypes()[0]));
      }
    }
    Constructor<?> k = c.getDeclaredConstructor();
    k.setAccessible(true);
    Object n = k.newInstance();
    set(n, "val", val);
    return n;
  }

  /* ---------------------------------------------------------- node adapters */

  static Object listFrom(List<?> values) throws Exception {
    Object head = null;
    for (int i = values.size() - 1; i >= 0; i--) {
      Object n = node("ListNode", values.get(i));
      field(n.getClass(), "next").set(n, head);
      head = n;
    }
    return head;
  }

  static List<Object> listTo(Object head) throws Exception {
    List<Object> out = new ArrayList<>();
    Set<Object> seen = Collections.newSetFromMap(new IdentityHashMap<>());
    for (Object n = head; n != null; n = get(n, "next")) {
      if (!seen.add(n)) throw new IllegalStateException("Output linked list contains a cycle");
      out.add(plain(get(n, "val")));
    }
    return out;
  }

  static Object treeFrom(List<?> values) throws Exception {
    if (values.isEmpty() || values.get(0) == null) return null;
    Object root = node("TreeNode", values.get(0));
    Deque<Object> queue = new ArrayDeque<>();
    queue.add(root);
    int i = 1;
    while (!queue.isEmpty() && i < values.size()) {
      Object n = queue.poll();
      for (String side : new String[] {"left", "right"}) {
        if (i < values.size() && values.get(i) != null) {
          Object child = node("TreeNode", values.get(i));
          field(n.getClass(), side).set(n, child);
          queue.add(child);
        }
        i++;
      }
    }
    return root;
  }

  static List<Object> treeTo(Object root) throws Exception {
    List<Object> out = new ArrayList<>();
    Deque<Object> queue = new LinkedList<>();
    queue.add(root);
    Set<Object> seen = Collections.newSetFromMap(new IdentityHashMap<>());
    while (!queue.isEmpty()) {
      Object n = queue.poll();
      if (n == null) {
        out.add(null);
        continue;
      }
      if (!seen.add(n)) throw new IllegalStateException("Output tree contains a cycle");
      out.add(plain(get(n, "val")));
      queue.add(get(n, "left"));
      queue.add(get(n, "right"));
    }
    while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
    return out;
  }

  static Object findTree(Object root, Object val) throws Exception {
    Deque<Object> stack = new ArrayDeque<>();
    if (root != null) stack.push(root);
    while (!stack.isEmpty()) {
      Object n = stack.pop();
      if (String.valueOf(plain(get(n, "val"))).equals(String.valueOf(plain(val)))) return n;
      for (String side : new String[] {"left", "right"}) {
        Object child = get(n, side);
        if (child != null) stack.push(child);
      }
    }
    return null;
  }

  // Graph: adjacency list where node i+1 has neighbours adj[i] (LeetCode "Clone Graph").
  @SuppressWarnings("unchecked")
  static Object graphFrom(List<?> adj) throws Exception {
    if (adj.isEmpty()) return null;
    List<Object> nodes = new ArrayList<>();
    for (int i = 0; i < adj.size(); i++) nodes.add(node("Node", (long) (i + 1)));
    for (int i = 0; i < adj.size(); i++) {
      Object n = nodes.get(i);
      Field f = field(n.getClass(), "neighbors");
      Collection<Object> neighbors = (Collection<Object>) f.get(n);
      if (neighbors == null) {
        neighbors = new ArrayList<>();
        f.set(n, neighbors);
      }
      for (Object k : (List<?>) adj.get(i)) neighbors.add(nodes.get(((Number) k).intValue() - 1));
    }
    return nodes.get(0);
  }

  static List<Object> graphTo(Object start) throws Exception {
    if (start == null) return new ArrayList<>();
    Map<Long, Object> byVal = new TreeMap<>();
    Deque<Object> queue = new ArrayDeque<>();
    queue.add(start);
    while (!queue.isEmpty()) {
      Object n = queue.poll();
      long val = ((Number) get(n, "val")).longValue();
      if (byVal.containsKey(val)) continue;
      byVal.put(val, n);
      Object ns = get(n, "neighbors");
      if (ns != null) queue.addAll((Collection<?>) ns);
    }
    List<Object> out = new ArrayList<>();
    for (Object n : byVal.values()) {
      List<Object> row = new ArrayList<>();
      Object ns = get(n, "neighbors");
      if (ns != null) for (Object k : (Collection<?>) ns) row.add(plain(get(k, "val")));
      out.add(row);
    }
    return out;
  }

  // Random list: [[val, randomIndex | null], ...]
  static Object randomFrom(List<?> pairs) throws Exception {
    List<Object> nodes = new ArrayList<>();
    for (Object p : pairs) nodes.add(node("Node", ((List<?>) p).get(0)));
    for (int i = 0; i < nodes.size(); i++) {
      Object n = nodes.get(i);
      field(n.getClass(), "next").set(n, i + 1 < nodes.size() ? nodes.get(i + 1) : null);
      Object r = ((List<?>) pairs.get(i)).get(1);
      field(n.getClass(), "random").set(n, r == null ? null : nodes.get(((Number) r).intValue()));
    }
    return nodes.isEmpty() ? null : nodes.get(0);
  }

  static List<Object> randomTo(Object head) throws Exception {
    List<Object> nodes = new ArrayList<>();
    Map<Object, Integer> index = new IdentityHashMap<>();
    for (Object n = head; n != null; n = get(n, "next")) {
      if (index.containsKey(n)) throw new IllegalStateException("Output list contains a cycle");
      index.put(n, nodes.size());
      nodes.add(n);
    }
    List<Object> out = new ArrayList<>();
    for (Object n : nodes) {
      Object r = get(n, "random");
      List<Object> pair = new ArrayList<>();
      pair.add(plain(get(n, "val")));
      pair.add(r == null ? null : (Object) (long) index.getOrDefault(r, -1));
      out.add(pair);
    }
    return out;
  }

  /** Every node reachable from `value`, by identity (for clone questions). */
  static Set<Object> collect(Object value, String type) throws Exception {
    Set<Object> out = Collections.newSetFromMap(new IdentityHashMap<>());
    if (value == null) return out;
    if ("GraphNode".equals(type)) {
      Deque<Object> queue = new ArrayDeque<>();
      queue.add(value);
      while (!queue.isEmpty()) {
        Object n = queue.poll();
        if (!out.add(n)) continue;
        Object ns = get(n, "neighbors");
        if (ns != null) queue.addAll((Collection<?>) ns);
      }
    } else {
      for (Object n = value; n != null && out.add(n); n = get(n, "next")) {
        // walk
      }
    }
    return out;
  }

  /* ------------------------------------------------------------ inputs */

  /** A case value for parameter `param` (its cases.json spec) as the method's `target` type. */
  static Object toInput(Map<?, ?> param, Object json, Type target, List<Object> built) throws Exception {
    String type = String.valueOf(param.get("type"));
    switch (type) {
      case "ListNode":
        return listFrom((List<?>) json);
      case "ListNode[]": {
        List<Object> lists = new ArrayList<>();
        for (Object l : (List<?>) json) lists.add(listFrom((List<?>) l));
        return asType(lists, target);
      }
      case "ListNodeCycle": {
        // {"list": [3, 2, 0, -4], "pos": 1}: the tail links back to index pos (-1 = no cycle).
        Map<?, ?> m = (Map<?, ?>) json;
        Object head = listFrom((List<?>) m.get("list"));
        int pos = ((Number) m.get("pos")).intValue();
        if (pos >= 0 && head != null) {
          Object tail = head;
          Object target2 = null;
          for (int i = 0; ; i++) {
            if (i == pos) target2 = tail;
            Object next = get(tail, "next");
            if (next == null) break;
            tail = next;
          }
          field(tail.getClass(), "next").set(tail, target2);
        }
        return head;
      }
      case "TreeNode":
        return treeFrom((List<?>) json);
      case "TreeNodeRef": {
        Object of = param.get("of");
        return findTree(built.get(of == null ? 0 : ((Number) of).intValue()), json);
      }
      case "GraphNode":
        return graphFrom((List<?>) json);
      case "RandomListNode":
        return randomFrom((List<?>) json);
      default:
        return toJava(json, target);
    }
  }

  /** Node lists built above, as the array or List the method declared. */
  private static Object asType(List<Object> values, Type target) {
    if (target instanceof Class && ((Class<?>) target).isArray()) {
      Object arr = Array.newInstance(((Class<?>) target).getComponentType(), values.size());
      for (int i = 0; i < values.size(); i++) Array.set(arr, i, values.get(i));
      return arr;
    }
    return values;
  }

  private static Class<?> raw(Type t) {
    if (t instanceof Class) return (Class<?>) t;
    if (t instanceof ParameterizedType) return raw(((ParameterizedType) t).getRawType());
    if (t instanceof GenericArrayType) return Array.newInstance(raw(((GenericArrayType) t).getGenericComponentType()), 0).getClass();
    if (t instanceof WildcardType) return raw(((WildcardType) t).getUpperBounds()[0]);
    return Object.class;
  }

  private static Collection<Object> newCollection(Class<?> raw) {
    if (SortedSet.class.isAssignableFrom(raw)) return new TreeSet<>();
    if (Set.class.isAssignableFrom(raw)) return new LinkedHashSet<>();
    if (Deque.class.isAssignableFrom(raw) || Queue.class.isAssignableFrom(raw)) return new ArrayDeque<>();
    if (raw == LinkedList.class) return new LinkedList<>();
    return new ArrayList<>();
  }

  /** A plain JSON value as Java type `type`. */
  static Object toJava(Object v, Type type) {
    if (type instanceof TypeVariable) type = Object.class;
    if (type instanceof WildcardType) type = ((WildcardType) type).getUpperBounds()[0];
    if (type instanceof ParameterizedType) {
      ParameterizedType p = (ParameterizedType) type;
      Class<?> raw = raw(p);
      Type[] args = p.getActualTypeArguments();
      if (v == null) return null;
      if (Map.class.isAssignableFrom(raw)) {
        Map<Object, Object> out = new HashMap<>();
        for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) out.put(toJava(e.getKey(), args[0]), toJava(e.getValue(), args[1]));
        return out;
      }
      if (Iterable.class.isAssignableFrom(raw)) {
        Collection<Object> out = newCollection(raw);
        for (Object x : (List<?>) v) out.add(toJava(x, args[0]));
        return out;
      }
      return toJava(v, raw);
    }
    if (type instanceof GenericArrayType) {
      Type component = ((GenericArrayType) type).getGenericComponentType();
      List<?> list = (List<?>) v;
      Object arr = Array.newInstance(raw(component), list.size());
      for (int i = 0; i < list.size(); i++) Array.set(arr, i, toJava(list.get(i), component));
      return arr;
    }
    Class<?> c = (Class<?>) type;
    if (v == null) {
      if (c.isPrimitive()) throw new IllegalArgumentException("null can't be a " + c.getName());
      return null;
    }
    if (c == int.class || c == Integer.class) return ((Number) v).intValue();
    if (c == long.class || c == Long.class) return ((Number) v).longValue();
    if (c == double.class || c == Double.class) return ((Number) v).doubleValue();
    if (c == float.class || c == Float.class) return ((Number) v).floatValue();
    if (c == short.class || c == Short.class) return ((Number) v).shortValue();
    if (c == byte.class || c == Byte.class) return ((Number) v).byteValue();
    if (c == boolean.class || c == Boolean.class) return (Boolean) v;
    if (c == char.class || c == Character.class) return v instanceof String ? ((String) v).charAt(0) : (char) ((Number) v).intValue();
    if (c == String.class) return (String) v;
    if (c.isArray()) {
      Class<?> component = c.getComponentType();
      if (component == char.class && v instanceof String) return ((String) v).toCharArray();
      List<?> list = (List<?>) v;
      Object arr = Array.newInstance(component, list.size());
      for (int i = 0; i < list.size(); i++) Array.set(arr, i, toJava(list.get(i), component));
      return arr;
    }
    if (Iterable.class.isAssignableFrom(c)) {
      Collection<Object> out = newCollection(c);
      for (Object x : (List<?>) v) out.add(toJava(x, Object.class));
      return out;
    }
    if (c == Object.class) return objectValue(v);
    throw new IllegalArgumentException("can't turn " + FpJson.write(v) + " into a " + c.getSimpleName());
  }

  /** JSON as untyped Java: whole numbers become Integer when they fit, like LeetCode's Object params. */
  private static Object objectValue(Object v) {
    if (v instanceof Long && (Long) v >= Integer.MIN_VALUE && (Long) v <= Integer.MAX_VALUE) return ((Long) v).intValue();
    if (v instanceof List) {
      List<Object> out = new ArrayList<>();
      for (Object x : (List<?>) v) out.add(objectValue(x));
      return out;
    }
    return v;
  }

  /* ------------------------------------------------------------ outputs */

  /** The method's result as comparable JSON for spec type `type` (see core.js fromOutput). */
  static Object fromOutput(String type, Object value) throws Exception {
    switch (type == null ? "" : type) {
      case "ListNode":
      case "ListNodeCycle":
        return listTo(value);
      case "TreeNode":
        return treeTo(value);
      case "TreeNodeVal":
        return value == null ? null : plain(get(value, "val"));
      case "GraphNode":
        return graphTo(value);
      case "RandomListNode":
        return randomTo(value);
      default:
        return plain(value);
    }
  }

  /** Plain data as JSON-compatible values: numbers, strings, lists, maps. */
  static Object plain(Object v) {
    if (v == null || v instanceof Boolean || v instanceof String) return v;
    if (v instanceof Character) return String.valueOf(v);
    if (v instanceof Double || v instanceof Float) return ((Number) v).doubleValue();
    if (v instanceof Number) return ((Number) v).longValue();
    if (v.getClass().isArray()) {
      List<Object> out = new ArrayList<>();
      for (int i = 0; i < Array.getLength(v); i++) out.add(plain(Array.get(v, i)));
      return out;
    }
    if (v instanceof Iterable) {
      List<Object> out = new ArrayList<>();
      for (Object x : (Iterable<?>) v) out.add(plain(x));
      return out;
    }
    if (v instanceof Map) {
      Map<String, Object> out = new LinkedHashMap<>();
      for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) out.put(String.valueOf(e.getKey()), plain(e.getValue()));
      return out;
    }
    throw new IllegalArgumentException("Can't compare a " + v.getClass().getSimpleName() + " output; return plain data");
  }
}
