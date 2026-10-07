---
title: Template Engine
type: js
difficulty: medium
topic: strings-parsing
order: 5
tags: [strings, parsing, regex, security]
estimatedMinutes: 20
---

Implement `render(template, data)`, a tiny Mustache-style template engine. It returns `template` with every `{{ path }}` token replaced by the matching value from `data`.

- **Paths:** a key (`name`) or a dotted path into nested objects (`user.address.city`).
- **Whitespace** inside the braces is allowed: `{{name}}`, `{{ name }}` and `{{  name  }}` are the same.
- **Missing values:** if any part of the path is missing, or the value is `null`/`undefined`, insert `''`.
- **Other values** are converted with `String(value)`, so `0` → `'0'` and `false` → `'false'`.
- **Escaping:** values from `{{ }}` are HTML-escaped: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`, `'` → `&#39;`.
- **Raw output:** `{{{ path }}}` (triple braces) inserts the value **without** escaping.

Text outside tokens is copied unchanged.

```js
render('Hello, {{ user.name }}!', { user: { name: 'Ada' } }); // 'Hello, Ada!'
render('{{ missing }}|{{ count }}|{{ ok }}', { count: 0, ok: false }); // '|0|false'
render('<p>{{ html }}</p>', { html: '<b>hi</b>' }); // '<p>&lt;b&gt;hi&lt;/b&gt;</p>'
render('<p>{{{ html }}}</p>', { html: '<b>hi</b>' }); // '<p><b>hi</b></p>'
```

**Constraints:** the template itself is never escaped, only inserted values. A value that itself contains `{{ ... }}` is inserted literally and not rendered again.

## Notes

- **Approach:** one `replace` with a global regex that matches triple braces first: `/\{\{\{\s*([^{}]+?)\s*\}\}\}|\{\{\s*([^{}]+?)\s*\}\}/g`. The replacer gets either the raw or the escaped path, resolves it with `path.split('.').reduce((obj, key) => obj?.[key], data)`, and maps `null`/`undefined` to `''`.
- **Why one pass:** a single `replace` never re-scans what it inserted, so values containing `{{x}}` can't inject more tokens.
- **Escape `&` first** (or use a lookup map in one pass); otherwise `&lt;` becomes `&amp;lt;`.
- **Pitfall:** `value || ''` turns `0` and `false` into `''`. Use `value == null ? '' : String(value)`.
- **Security:** escaping by default and making unescaped output opt-in (`{{{ }}}`) is how Mustache/Handlebars prevent XSS. Escaping alone isn't enough inside attributes without quotes, `<script>` or URLs.
- **Complexity:** O(template length + output length).
- **Follow-ups:** sections/loops (`{{#items}}...{{/items}}`), conditionals, partials, helpers, or compiling the template once into a function for reuse.
