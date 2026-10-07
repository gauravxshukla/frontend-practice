import render from './solution.js';

describe('render', () => {
  test('example: replaces keys and dotted paths', () => {
    expect(render('Hello, {{ user.name }}!', { user: { name: 'Ada' } })).toBe('Hello, Ada!');
  });

  test('example: escapes by default, triple braces insert raw', () => {
    expect(render('<p>{{ html }}</p>', { html: '<b>hi</b>' })).toBe('<p>&lt;b&gt;hi&lt;/b&gt;</p>');
    expect(render('<p>{{{ html }}}</p>', { html: '<b>hi</b>' })).toBe('<p><b>hi</b></p>');
  });

  test('whitespace inside the braces is optional', () => {
    const data = { name: 'Ada' };
    expect(render('{{name}}|{{ name }}|{{   name   }}|{{{name}}}|{{{  name }}}', data)).toBe(
      'Ada|Ada|Ada|Ada|Ada',
    );
  });

  test('missing values render as empty strings', () => {
    expect(render('[{{ missing }}]', {})).toBe('[]');
    expect(render('[{{ a.b.c }}]', { a: {} })).toBe('[]');
    expect(render('[{{ a.b.c }}]', { a: null })).toBe('[]');
    expect(render('[{{ x }}][{{{ y }}}]', { x: null, y: undefined })).toBe('[][]');
  });

  test('renders 0, false and numbers as strings', () => {
    expect(render('{{ zero }}|{{ no }}|{{ n }}|{{{ zero }}}', { zero: 0, no: false, n: 3.5 })).toBe(
      '0|false|3.5|0',
    );
  });

  test('escapes all five HTML characters', () => {
    expect(render('{{ v }}', { v: `& < > " '` })).toBe('&amp; &lt; &gt; &quot; &#39;');
  });

  test('does not double-escape', () => {
    expect(render('{{ v }}', { v: '&lt;' })).toBe('&amp;lt;');
    expect(render('{{{ v }}}', { v: '&lt;' })).toBe('&lt;');
  });

  test('does not escape the template itself', () => {
    expect(render('<a href="x">{{ t }}</a> & more', { t: 'link' })).toBe('<a href="x">link</a> & more');
  });

  test('replaces repeated and adjacent tokens', () => {
    expect(render('{{a}}{{b}}-{{a}}', { a: 'x', b: 'y' })).toBe('xy-x');
  });

  test('inserted values are not rendered again', () => {
    expect(render('{{ a }}', { a: '{{ b }}', b: 'nope' })).toBe('{{ b }}');
    expect(render('{{{ a }}}', { a: '{{ b }}', b: 'nope' })).toBe('{{ b }}');
  });

  test('templates without tokens are returned unchanged', () => {
    expect(render('plain text { not } a token', { a: 1 })).toBe('plain text { not } a token');
    expect(render('', { a: 1 })).toBe('');
  });

  test('resolves deeply nested paths and array indexes', () => {
    const data = { order: { items: [{ name: 'Pen' }], customer: { address: { city: 'Pune' } } } };
    expect(render('{{ order.customer.address.city }}: {{ order.items.0.name }}', data)).toBe('Pune: Pen');
  });
});
