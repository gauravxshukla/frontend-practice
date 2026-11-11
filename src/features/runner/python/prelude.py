# Python side of the DSA runner, loaded once into Pyodide (browser worker and
# scripts/verify-python.test.js). It mirrors src/features/runner/core.js:
# JSON case inputs -> Python values (ListNode, TreeNode, Node...), call the
# user's code, Python result -> comparable JSON. Judging stays in core.js so
# every language is graded by the same code.
#
# Entry point: _fp_run(code, spec_json, cases_json) -> JSON string, one of
#   {"type": "outputs", "outputs": [{index, output?, error?, stdout}], "runtimeMs"}
#   {"type": "compile-error", "message"}
#   {"type": "internal-error", "message"}
# where stdout is [[level, line], ...] and error is {"message", "line"}.

import io
import json
import sys
import time
import traceback
from collections import deque

_USER_FILE = "solution.py"
_MAX_LINES = 200
_MAX_LINE_CHARS = 2000


# ---------------------------------------------------------------- node types
# LeetCode's definitions, available to user code without an import.

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"


class _GraphNode:
    """`Node` in graph questions (Clone Graph)."""

    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

    def __repr__(self):
        return f"Node({self.val})"


class _RandomNode:
    """`Node` in Copy List with Random Pointer."""

    def __init__(self, x=0, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random

    def __repr__(self):
        return f"Node({self.val})"


# What user code sees as globals: LeetCode's usual imports plus the node classes.
_USER_PRELUDE = """
from typing import *
import collections, heapq, bisect, math, functools, itertools, string, re, random, operator
from collections import deque, defaultdict, Counter, OrderedDict
from functools import lru_cache, cache, reduce, cmp_to_key
from heapq import heappush, heappop, heapify, heappushpop, heapreplace, nlargest, nsmallest
from bisect import bisect_left, bisect_right, insort
from itertools import accumulate, combinations, permutations, product, chain, groupby
from math import inf, gcd, sqrt, ceil, floor, comb
"""
_BASE_GLOBALS = {"__builtins__": __builtins__}
exec(_USER_PRELUDE, _BASE_GLOBALS)
_BASE_GLOBALS.update(ListNode=ListNode, TreeNode=TreeNode)


# ------------------------------------------------------------------ adapters

def _list_from_array(arr):
    head = None
    for v in reversed(arr):
        head = ListNode(v, head)
    return head


def _list_to_array(head):
    out, seen = [], set()
    while head is not None:
        if id(head) in seen:
            raise ValueError("Output linked list contains a cycle")
        seen.add(id(head))
        out.append(head.val)
        head = head.next
    return out


def _tree_from_array(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, i = deque([root]), 1
    while queue and i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def _tree_to_array(root):
    out, queue, seen = [], deque([root]), set()
    while queue:
        node = queue.popleft()
        if node is None:
            out.append(None)
            continue
        if id(node) in seen:
            raise ValueError("Output tree contains a cycle")
        seen.add(id(node))
        out.append(node.val)
        queue.append(getattr(node, "left", None))
        queue.append(getattr(node, "right", None))
    while out and out[-1] is None:
        out.pop()
    return out


def _find_tree_node(root, val):
    stack = [root]
    while stack:
        node = stack.pop()
        if node is None:
            continue
        if node.val == val:
            return node
        stack.extend((node.left, node.right))
    return None


def _graph_from_adj(adj):
    # Node i+1 has neighbours adj[i] (LeetCode's Clone Graph format).
    if not adj:
        return None
    nodes = [_GraphNode(i + 1) for i in range(len(adj))]
    for i, ns in enumerate(adj):
        nodes[i].neighbors = [nodes[n - 1] for n in ns]
    return nodes[0]


def _graph_to_adj(start):
    if start is None:
        return []
    by_val, queue = {}, deque([start])
    while queue:
        node = queue.popleft()
        if node.val in by_val:
            continue
        by_val[node.val] = node
        queue.extend(node.neighbors or [])
    return [[n.val for n in (by_val[v].neighbors or [])] for v in sorted(by_val)]


def _random_list_from_pairs(pairs):
    nodes = [_RandomNode(val) for val, _ in pairs]
    for i, node in enumerate(nodes):
        node.next = nodes[i + 1] if i + 1 < len(nodes) else None
        r = pairs[i][1]
        node.random = None if r is None else nodes[r]
    return nodes[0] if nodes else None


def _random_list_to_pairs(head):
    nodes, seen = [], set()
    while head is not None:
        if id(head) in seen:
            raise ValueError("Output list contains a cycle")
        seen.add(id(head))
        nodes.append(head)
        head = head.next
    index = {id(n): i for i, n in enumerate(nodes)}
    return [[n.val, None if n.random is None else index.get(id(n.random), -1)] for n in nodes]


def _collect_nodes(value, type_):
    out = set()
    if value is None:
        return out
    if type_ == "GraphNode":
        queue = deque([value])
        while queue:
            n = queue.popleft()
            if id(n) in out:
                continue
            out.add(id(n))
            queue.extend(n.neighbors or [])
    else:
        while value is not None and id(value) not in out:
            out.add(id(value))
            value = value.next
    return out


def _to_input(param, value, built):
    t = param["type"]
    if t == "ListNode":
        return _list_from_array(value)
    if t == "ListNode[]":
        return [_list_from_array(v) for v in value]
    if t == "ListNodeCycle":
        # {"list": [3, 2, 0, -4], "pos": 1}: the tail links back to index pos (-1 = no cycle).
        head = _list_from_array(value["list"])
        if value["pos"] >= 0 and head is not None:
            tail, target, i = head, None, 0
            while True:
                if i == value["pos"]:
                    target = tail
                if tail.next is None:
                    break
                tail, i = tail.next, i + 1
            tail.next = target
        return head
    if t == "TreeNode":
        return _tree_from_array(value)
    if t == "TreeNodeRef":
        return _find_tree_node(built[param.get("of", 0)], value)
    if t == "GraphNode":
        return _graph_from_adj(value)
    if t == "RandomListNode":
        return _random_list_from_pairs(value)
    # Case values come straight from json.loads, so they're already fresh copies.
    return value


def _jsonable(value):
    """Plain data -> JSON-compatible values (tuples/sets/deques become lists)."""
    if value is None or isinstance(value, (bool, int, str)):
        return value
    if isinstance(value, float):
        if value != value or value in (float("inf"), float("-inf")):
            raise ValueError(f"Output {value} isn't a finite number")
        return value
    if isinstance(value, (list, tuple, deque)):
        return [_jsonable(v) for v in value]
    if isinstance(value, (set, frozenset)):
        return [_jsonable(v) for v in value]
    if isinstance(value, dict):
        return {str(k): _jsonable(v) for k, v in value.items()}
    raise TypeError(f"Can't compare a {type(value).__name__} output; return plain data")


def _from_output(type_, value):
    if type_ in ("ListNode", "ListNodeCycle"):
        return _list_to_array(value)
    if type_ == "TreeNode":
        return _tree_to_array(value)
    if type_ == "TreeNodeVal":
        return None if value is None else value.val
    if type_ == "GraphNode":
        return _graph_to_adj(value)
    if type_ == "RandomListNode":
        return _random_list_to_pairs(value)
    return _jsonable(value)


# ------------------------------------------------------------------- capture

class _Sink:
    """Collects [level, line] pairs from stdout/stderr, capped."""

    def __init__(self):
        self.lines = []
        self.dropped = 0

    def add(self, level, line):
        if len(self.lines) < _MAX_LINES:
            if len(line) > _MAX_LINE_CHARS:
                line = line[:_MAX_LINE_CHARS] + "…"
            self.lines.append([level, line])
        else:
            self.dropped += 1

    def result(self):
        if self.dropped:
            return self.lines + [["warn", f"… {self.dropped} more lines truncated"]]
        return self.lines


class _LineWriter(io.TextIOBase):
    def __init__(self, sink, level):
        self.sink, self.level, self.buf = sink, level, ""

    def writable(self):
        return True

    def write(self, s):
        self.buf += str(s)
        while "\n" in self.buf:
            line, self.buf = self.buf.split("\n", 1)
            self.sink.add(self.level, line)
        return len(s)

    def finish(self):
        if self.buf:
            self.sink.add(self.level, self.buf)
            self.buf = ""


class _HarnessError(Exception):
    """The harness couldn't build a case's input: a content or harness bug, not the user's."""


def _captured(fn):
    """Runs fn() with print() captured; returns (value, error, stdout)."""
    sink = _Sink()
    out, err = _LineWriter(sink, "log"), _LineWriter(sink, "error")
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    try:
        return fn(), None, sink
    except BaseException as e:  # noqa: B036 - exit() / SystemExit in user code is still the user's error
        return None, e, sink
    finally:
        sys.stdout, sys.stderr = old_out, old_err
        out.finish()
        err.finish()


def _error_line(error):
    """Line in the user's file where `error` was raised, if it came from there."""
    line = None
    for frame in traceback.extract_tb(error.__traceback__):
        if frame.filename == _USER_FILE:
            line = frame.lineno
    return line


def _describe(error):
    return {"message": f"{type(error).__name__}: {error}", "line": _error_line(error)}


# ----------------------------------------------------------------- execution

def _call_function(g, spec, inp):
    name = spec["fn"]
    solution = g.get("Solution")
    if isinstance(solution, type):
        # LeetCode builds a fresh Solution for every testcase.
        target = getattr(solution(), name, None)
    else:
        target = g.get(name)
    if not callable(target):
        raise NameError(f"Define class Solution with a method {name}(self, ...)")

    built = []
    try:
        for i, p in enumerate(spec["params"]):
            built.append(_to_input(p, inp[i], built))
    except Exception as e:
        raise _HarnessError(f"Couldn't build input {inp!r}: {e}") from e
    first = spec["params"][0] if spec["params"] else None
    input_nodes = _collect_nodes(built[0], first["type"]) if spec.get("freshNodes") and first else None

    result = target(*built)

    if input_nodes is not None and _collect_nodes(result, spec["returns"]) & input_nodes:
        raise ValueError("Output reuses nodes from the input; it must be a deep copy.")
    if spec.get("returns") == "void" or "mutates" in spec:
        idx = spec.get("mutates", 0)
        return _from_output(spec["params"][idx]["type"], built[idx])
    return _from_output(spec["returns"], result)


def _call_design(g, spec, inp):
    # LeetCode style: [["Cls", "op", ...], [[ctor args], [args], ...]]
    ops, args = inp
    cls = g.get(ops[0])
    if not isinstance(cls, type):
        raise NameError(f"Define class {ops[0]}")
    instance, out = None, []
    for i, op in enumerate(ops):
        if i == 0:
            instance = cls(*args[0])
            out.append(None)
            continue
        method = getattr(instance, op, None)
        if not callable(method):
            raise AttributeError(f"{ops[0]}.{op} is not a method")
        out.append(_jsonable(method(*args[i])))
    return out


def _call_codec(g, spec, inp):
    # Round trip: decode(encode(x)) must give x back.
    encode_name, decode_name = spec.get("methods", ["encode", "decode"])
    codec_cls = g.get("Codec")
    if isinstance(codec_cls, type):
        codec = codec_cls()
        encode, decode = getattr(codec, encode_name, None), getattr(codec, decode_name, None)
    else:
        encode, decode = g.get(encode_name), g.get(decode_name)
    if not callable(encode) or not callable(decode):
        raise NameError(f"Define class Codec with {encode_name}() and {decode_name}()")
    param = spec["params"][0]
    try:
        value = _to_input(param, inp[0], [])
    except Exception as e:
        raise _HarnessError(f"Couldn't build input {inp!r}: {e}") from e
    encoded = encode(value)
    if not isinstance(encoded, str):
        raise TypeError(f"{encode_name} must return a str")
    return _from_output(spec.get("returns", param["type"]), decode(encoded))


_KINDS = {"function": _call_function, "design": _call_design, "codec": _call_codec}


def _uses_type(spec, type_):
    return any(p["type"] == type_ for p in spec.get("params") or []) or spec.get("returns") == type_


def _fresh_globals(spec):
    g = dict(_BASE_GLOBALS)
    g["__name__"] = "solution"
    # LeetCode calls both node types `Node`; give each question the one it uses.
    if _uses_type(spec, "GraphNode"):
        g["Node"] = _GraphNode
    elif _uses_type(spec, "RandomListNode"):
        g["Node"] = _RandomNode
    return g


def _run(code, spec, cases):
    try:
        compiled = compile(code, _USER_FILE, "exec")
    except SyntaxError as e:
        kind = "" if type(e) is SyntaxError else f"{type(e).__name__}: "
        return {"type": "compile-error", "message": f"SyntaxError: {kind}{e.msg} (line {e.lineno})"}

    g = _fresh_globals(spec)
    _, error, _ = _captured(lambda: exec(compiled, g))
    if error is not None:
        line = _error_line(error)
        where = f" (line {line})" if line else ""
        return {"type": "compile-error", "message": f"{type(error).__name__}: {error}{where}"}

    call = _KINDS[spec.get("kind", "function")]
    outputs = []
    started = time.perf_counter()
    for index, kase in enumerate(cases):
        value, error, sink = _captured(lambda: call(g, spec, kase["input"]))
        if isinstance(error, _HarnessError):
            return {"type": "internal-error", "message": f"Case {index + 1}: {error}"}
        out = {"index": index, "stdout": sink.result()}
        if error is not None:
            out["error"] = _describe(error)
        else:
            out["output"] = value
        outputs.append(out)
    runtime_ms = round((time.perf_counter() - started) * 1000)
    return {"type": "outputs", "outputs": outputs, "runtimeMs": runtime_ms}


def _fp_run(code, spec_json, cases_json):
    try:
        result = _run(code, json.loads(spec_json), json.loads(cases_json))
    except Exception:
        # A bug in this harness, not in the user's code.
        result = {"type": "internal-error", "message": traceback.format_exc(limit=3)}
    return json.dumps(result)
