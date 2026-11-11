import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.OutputStream;
import java.io.PrintStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Java side of the DSA runner (CheerpJ in the browser, a real JVM in
 * scripts/verify-java.test.js). Mirrors core.js#execute: runs every case of a
 * job against the user's compiled classes and writes comparable JSON outputs;
 * judging stays in core.js so every language is graded by the same code.
 *
 * Usage: FpHarness <job.json> <result.json> [<runs dir> <current run dir name>]
 * Result: {"type":"outputs","outputs":[{index, output?, error?, stdout}],"runtimeMs"}
 *      or {"type":"internal-error","message"}
 */
public final class FpHarness {
  static final String USER_FILE = "Solution.java";
  private static final int MAX_LINES = 200;
  private static final int MAX_LINE_CHARS = 2000;

  /** The harness couldn't do its job (bad job file, missing input): not the user's error. */
  static final class HarnessError extends RuntimeException {
    private static final long serialVersionUID = 1L;

    HarnessError(String message, Throwable cause) {
      super(message, cause);
    }
  }

  /** One run's stdout + stderr as [[level, line], ...], capped. */
  static final class Capture {
    final List<Object> lines = new ArrayList<>();
    int dropped;

    PrintStream stream(String level) {
      return new PrintStream(new LineStream(this, level), true);
    }

    void add(String level, String line) {
      if (lines.size() >= MAX_LINES) {
        dropped++;
        return;
      }
      List<Object> entry = new ArrayList<>();
      entry.add(level);
      entry.add(line.length() > MAX_LINE_CHARS ? line.substring(0, MAX_LINE_CHARS) + "…" : line);
      lines.add(entry);
    }

    List<Object> result() {
      if (dropped == 0) return lines;
      List<Object> note = new ArrayList<>();
      note.add("warn");
      note.add("… " + dropped + " more lines truncated");
      List<Object> out = new ArrayList<>(lines);
      out.add(note);
      return out;
    }
  }

  /** Splits bytes into UTF-8 lines for a Capture. */
  static final class LineStream extends OutputStream {
    private final Capture capture;
    private final String level;
    private final ByteArrayOutputStream buf = new ByteArrayOutputStream();

    LineStream(Capture capture, String level) {
      this.capture = capture;
      this.level = level;
    }

    @Override
    public void write(int b) {
      if (b == '\n') flushLine();
      else buf.write(b);
    }

    void flushLine() {
      capture.add(level, new String(buf.toByteArray(), StandardCharsets.UTF_8));
      buf.reset();
    }

    @Override
    public void close() {
      if (buf.size() > 0) flushLine();
    }
  }

  public static void main(String[] args) throws Exception {
    if (args.length >= 4) cleanOldRuns(new File(args[2]), args[3]);
    Map<String, Object> result;
    try {
      result = run(new String(Files.readAllBytes(Paths.get(args[0])), StandardCharsets.UTF_8));
    } catch (Throwable t) {
      result = new LinkedHashMap<>();
      result.put("type", "internal-error");
      result.put("message", String.valueOf(t));
    }
    Files.write(Paths.get(args[1]), FpJson.write(result).getBytes(StandardCharsets.UTF_8));
  }

  /** Runs are compiled into fresh directories (CheerpJ's /files persists); drop earlier ones. */
  static void cleanOldRuns(File root, String keep) {
    File[] runs = root.listFiles();
    if (runs == null) return;
    for (File f : runs) if (f.getName().startsWith("run-") && !f.getName().equals(keep)) delete(f);
  }

  private static void delete(File f) {
    File[] children = f.listFiles();
    if (children != null) for (File c : children) delete(c);
    f.delete();
  }

  @SuppressWarnings("unchecked")
  static Map<String, Object> run(String jobJson) {
    Map<String, Object> job = (Map<String, Object>) FpJson.parse(jobJson);
    Map<String, Object> spec = (Map<String, Object>) job.get("spec");
    List<Object> cases = (List<Object>) job.get("cases");
    String kind = spec.containsKey("kind") ? String.valueOf(spec.get("kind")) : "function";

    List<Object> outputs = new ArrayList<>();
    PrintStream realOut = System.out;
    PrintStream realErr = System.err;
    long started = System.nanoTime();
    for (int index = 0; index < cases.size(); index++) {
      List<Object> input = (List<Object>) ((Map<String, Object>) cases.get(index)).get("input");
      Capture capture = new Capture();
      PrintStream out = capture.stream("log");
      PrintStream err = capture.stream("error");
      System.setOut(out);
      System.setErr(err);
      Map<String, Object> entry = new LinkedHashMap<>();
      entry.put("index", (long) index);
      try {
        Object value = runCase(kind, spec, input);
        FpJson.write(value); // fail here (NaN…) rather than when writing the whole result
        entry.put("output", value);
      } catch (Throwable t) {
        Throwable cause = unwrap(t);
        if (cause instanceof HarnessError) {
          Map<String, Object> failed = new LinkedHashMap<>();
          failed.put("type", "internal-error");
          failed.put("message", "Case " + (index + 1) + ": " + cause.getMessage());
          return failed;
        }
        entry.put("error", describe(cause));
      } finally {
        System.setOut(realOut);
        System.setErr(realErr);
        out.close();
        err.close();
      }
      entry.put("stdout", capture.result());
      outputs.add(entry);
    }
    Map<String, Object> result = new LinkedHashMap<>();
    result.put("type", "outputs");
    result.put("outputs", outputs);
    result.put("runtimeMs", (System.nanoTime() - started) / 1_000_000);
    return result;
  }

  static Throwable unwrap(Throwable t) {
    while (t instanceof InvocationTargetException && t.getCause() != null) t = t.getCause();
    return t;
  }

  /** `IndexOutOfBoundsException: Index 3…` and the line in the user's file it came from. */
  static Map<String, Object> describe(Throwable t) {
    Map<String, Object> error = new LinkedHashMap<>();
    String message = t.getMessage();
    Object line = null;
    for (StackTraceElement frame : t.getStackTrace()) {
      if (USER_FILE.equals(frame.getFileName()) && frame.getLineNumber() > 0) {
        line = (long) frame.getLineNumber();
        break;
      }
    }
    error.put("message", t.getClass().getSimpleName() + (message == null ? "" : ": " + message) + (line == null ? where(t) : ""));
    error.put("line", line);
    return error;
  }

  /**
   * ` (in Solution.twoSum)`: the innermost user method. CheerpJ keeps method names
   * in stack traces but not file names or line numbers, so this is the best pointer there.
   */
  static String where(Throwable t) {
    for (StackTraceElement frame : t.getStackTrace()) {
      String cls = frame.getClassName();
      if (cls.startsWith("java.") || cls.startsWith("jdk.") || cls.startsWith("sun.") || cls.startsWith("Fp")) continue;
      return " (in " + cls + "." + frame.getMethodName() + ")";
    }
    return "";
  }

  /* ------------------------------------------------------------ kinds */

  static Object runCase(String kind, Map<String, Object> spec, List<Object> input) throws Exception {
    switch (kind) {
      case "design":
        return runDesign(input);
      case "codec":
        return runCodec(spec, input);
      default:
        return runFunction(spec, input);
    }
  }

  static Class<?> userClass(String name, String hint) {
    try {
      return Class.forName(name);
    } catch (ClassNotFoundException e) {
      throw new IllegalStateException(hint);
    }
  }

  static Object newInstance(Class<?> c) throws Exception {
    Constructor<?> k = c.getDeclaredConstructor();
    k.setAccessible(true);
    return k.newInstance();
  }

  static Method method(Class<?> c, String name, int arity, String hint) {
    for (Class<?> k = c; k != null; k = k.getSuperclass()) {
      for (Method m : k.getDeclaredMethods()) {
        if (m.getName().equals(name) && m.getParameterCount() == arity && !m.isSynthetic()) {
          m.setAccessible(true);
          return m;
        }
      }
    }
    throw new IllegalStateException(hint);
  }

  /** Converts case values to a method's parameter types; mistakes in the signature are the user's to fix. */
  @SuppressWarnings("unchecked")
  static Object[] arguments(List<Object> params, List<Object> values, Type[] types, List<Object> built) {
    Object[] args = new Object[types.length];
    for (int i = 0; i < types.length; i++) {
      Map<String, Object> param = params == null ? new LinkedHashMap<>() : (Map<String, Object>) params.get(i);
      String name = param.containsKey("name") ? String.valueOf(param.get("name")) : "argument " + (i + 1);
      try {
        args[i] = param.containsKey("type") ? FpConvert.toInput(param, values.get(i), types[i], built) : FpConvert.toJava(values.get(i), types[i]);
      } catch (ClassCastException | IllegalArgumentException e) {
        throw new IllegalArgumentException("Can't pass " + name + " as " + types[i].getTypeName() + ": " + e.getMessage(), e);
      } catch (Exception e) {
        throw new HarnessError("Couldn't build " + name + ": " + e, e);
      }
      built.add(args[i]);
    }
    return args;
  }

  @SuppressWarnings("unchecked")
  static Object runFunction(Map<String, Object> spec, List<Object> input) throws Exception {
    String name = String.valueOf(spec.get("fn"));
    List<Object> params = (List<Object>) spec.get("params");
    String hint = "Define class Solution with a method " + name + "(...)";
    Class<?> solution = userClass("Solution", hint);
    Method m = method(solution, name, params.size(), hint + " taking " + params.size() + " argument" + (params.size() == 1 ? "" : "s"));
    // LeetCode builds a fresh Solution for every testcase.
    Object target = Modifier.isStatic(m.getModifiers()) ? null : newInstance(solution);

    List<Object> built = new ArrayList<>();
    Object[] args = arguments(params, input, m.getGenericParameterTypes(), built);
    Map<String, Object> first = params.isEmpty() ? null : (Map<String, Object>) params.get(0);
    Set<Object> inputNodes =
        Boolean.TRUE.equals(spec.get("freshNodes")) && first != null ? FpConvert.collect(args[0], String.valueOf(first.get("type"))) : null;

    Object result = m.invoke(target, args);

    String returns = (String) spec.get("returns");
    if (inputNodes != null) {
      for (Object n : FpConvert.collect(result, returns)) {
        if (inputNodes.contains(n)) throw new IllegalStateException("Output reuses nodes from the input; it must be a deep copy.");
      }
    }
    if ("void".equals(returns) || spec.containsKey("mutates")) {
      int idx = spec.containsKey("mutates") ? ((Number) spec.get("mutates")).intValue() : 0;
      return FpConvert.fromOutput(String.valueOf(((Map<String, Object>) params.get(idx)).get("type")), args[idx]);
    }
    return FpConvert.fromOutput(returns, result);
  }

  @SuppressWarnings("unchecked")
  static Object runDesign(List<Object> input) throws Exception {
    // LeetCode style: [["Cls", "op", ...], [[ctor args], [args], ...]]
    List<Object> ops = (List<Object>) input.get(0);
    List<Object> argLists = (List<Object>) input.get(1);
    String className = String.valueOf(ops.get(0));
    Class<?> c = userClass(className, "Define class " + className);

    List<Object> ctorArgs = (List<Object>) argLists.get(0);
    Constructor<?> ctor = null;
    for (Constructor<?> k : c.getDeclaredConstructors()) if (k.getParameterCount() == ctorArgs.size()) ctor = k;
    if (ctor == null) throw new IllegalStateException(className + " needs a constructor taking " + ctorArgs.size() + " argument(s)");
    ctor.setAccessible(true);
    Object instance = ctor.newInstance(arguments(null, ctorArgs, ctor.getGenericParameterTypes(), new ArrayList<>()));

    List<Object> out = new ArrayList<>();
    out.add(null);
    for (int i = 1; i < ops.size(); i++) {
      String op = String.valueOf(ops.get(i));
      List<Object> values = (List<Object>) argLists.get(i);
      Method m = method(c, op, values.size(), className + "." + op + " taking " + values.size() + " argument(s) is not defined");
      Object result = m.invoke(instance, arguments(null, values, m.getGenericParameterTypes(), new ArrayList<>()));
      out.add(m.getReturnType() == void.class ? null : FpConvert.plain(result));
    }
    return out;
  }

  @SuppressWarnings("unchecked")
  static Object runCodec(Map<String, Object> spec, List<Object> input) throws Exception {
    // Round trip: decode(encode(x)) must give x back.
    List<Object> names = spec.containsKey("methods") ? (List<Object>) spec.get("methods") : List.of("encode", "decode");
    String encodeName = String.valueOf(names.get(0));
    String decodeName = String.valueOf(names.get(1));
    String hint = "Define class Codec with " + encodeName + "() and " + decodeName + "()";
    Class<?> c = userClass("Codec", hint);
    Object codec = newInstance(c);
    Method encode = method(c, encodeName, 1, hint);
    Method decode = method(c, decodeName, 1, hint);

    Map<String, Object> param = (Map<String, Object>) ((List<Object>) spec.get("params")).get(0);
    Object[] args = arguments(List.of(param), input, encode.getGenericParameterTypes(), new ArrayList<>());
    Object encoded = encode.invoke(codec, args);
    if (!(encoded instanceof String)) throw new IllegalStateException(encodeName + " must return a String");
    Object decoded = decode.invoke(codec, encoded);
    String returns = spec.containsKey("returns") ? String.valueOf(spec.get("returns")) : String.valueOf(param.get("type"));
    return FpConvert.fromOutput(returns, decoded);
  }
}
