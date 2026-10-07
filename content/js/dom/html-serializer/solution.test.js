import serializeHTML from './solution.js';

describe('serializeHTML', () => {
  test('example: nests children with two-space indentation', () => {
    const tree = { tag: 'div', children: [{ tag: 'b', children: ['hi'] }] };
    expect(serializeHTML(tree)).toBe('<div>\n  <b>\n    hi\n  </b>\n</div>');
  });

  test('example: mixes text and element children in order', () => {
    const tree = {
      tag: 'p',
      children: ['Hello ', { tag: 'em', children: ['world'] }, '!'],
    };
    expect(serializeHTML(tree)).toBe(['<p>', '  Hello ', '  <em>', '    world', '  </em>', '  !', '</p>'].join('\n'));
  });

  test('uses a custom indent string', () => {
    const tree = { tag: 'ul', children: [{ tag: 'li', children: ['a'] }] };
    expect(serializeHTML(tree, '\t')).toBe('<ul>\n\t<li>\n\t\ta\n\t</li>\n</ul>');
    expect(serializeHTML(tree, '    ')).toBe('<ul>\n    <li>\n        a\n    </li>\n</ul>');
  });

  test('an element with no children is an opening and a closing line', () => {
    expect(serializeHTML({ tag: 'div', children: [] })).toBe('<div>\n</div>');
    expect(serializeHTML({ tag: 'span' })).toBe('<span>\n</span>');
  });

  test('a string root is returned unchanged', () => {
    expect(serializeHTML('just text')).toBe('just text');
  });

  test('handles several siblings and deeper nesting', () => {
    const tree = {
      tag: 'html',
      children: [
        { tag: 'head', children: [{ tag: 'title', children: ['T'] }] },
        { tag: 'body', children: [{ tag: 'div', children: [{ tag: 'p', children: ['x'] }] }] },
      ],
    };
    expect(serializeHTML(tree)).toBe(
      [
        '<html>',
        '  <head>',
        '    <title>',
        '      T',
        '    </title>',
        '  </head>',
        '  <body>',
        '    <div>',
        '      <p>',
        '        x',
        '      </p>',
        '    </div>',
        '  </body>',
        '</html>',
      ].join('\n'),
    );
  });

  test('writes text as-is, without escaping or trimming', () => {
    const tree = { tag: 'code', children: ['  a < b && c > d  '] };
    expect(serializeHTML(tree)).toBe('<code>\n    a < b && c > d  \n</code>');
  });

  test('has no trailing newline', () => {
    expect(serializeHTML({ tag: 'i', children: ['x'] }).endsWith('\n')).toBe(false);
  });

  test('does not mutate the tree', () => {
    const tree = { tag: 'div', children: [{ tag: 'b', children: ['hi'] }, 'text'] };
    const copy = JSON.parse(JSON.stringify(tree));
    serializeHTML(tree);
    expect(tree).toEqual(copy);
  });
});
