const SHORT_ESCAPES = {
  '"': '\\"',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
};

function quote(str) {
  const escaped = str.replace(
    // eslint-disable-next-line no-control-regex
    /["\\\u0000-\u001f]/g,
    (ch) => SHORT_ESCAPES[ch] ?? `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
  return `"${escaped}"`;
}

/**
 * @param {any} value
 * @return {string | undefined}
 */
export default function jsonStringify(value) {
  // Objects currently being serialised (the path from the root), for cycle detection.
  const stack = [];

  function serialize(val, key) {
    if (val !== null && typeof val === 'object' && typeof val.toJSON === 'function') {
      val = val.toJSON(key);
    }
    if (val instanceof Number || val instanceof String || val instanceof Boolean) {
      val = val.valueOf();
    }

    if (val === null) return 'null';
    switch (typeof val) {
      case 'string':
        return quote(val);
      case 'number':
        return Number.isFinite(val) ? String(val) : 'null';
      case 'boolean':
        return String(val);
      case 'bigint':
        throw new TypeError('Do not know how to serialize a BigInt');
      case 'undefined':
      case 'function':
      case 'symbol':
        return undefined;
    }

    if (stack.includes(val)) {
      throw new TypeError('Converting circular structure to JSON');
    }
    stack.push(val);

    let out;
    if (Array.isArray(val)) {
      const items = [];
      // Index loop, so holes are read as undefined and become null.
      for (let i = 0; i < val.length; i++) {
        items.push(serialize(val[i], String(i)) ?? 'null');
      }
      out = `[${items.join(',')}]`;
    } else {
      const entries = [];
      for (const k of Object.keys(val)) {
        const s = serialize(val[k], k);
        if (s !== undefined) entries.push(`${quote(k)}:${s}`);
      }
      out = `{${entries.join(',')}}`;
    }

    stack.pop();
    return out;
  }

  return serialize(value, '');
}
