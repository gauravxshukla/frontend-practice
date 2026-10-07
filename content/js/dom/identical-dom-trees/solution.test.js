import identicalDOMTrees from './solution.js';

/** Parses an HTML string into a detached <div> wrapper. */
function parse(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('identicalDOMTrees', () => {
  test('example: attribute order does not matter', () => {
    expect(identicalDOMTrees(parse('<p class="x" id="1">hi</p>'), parse('<p id="1" class="x">hi</p>'))).toBe(true);
  });

  test('example: different text is not identical', () => {
    expect(identicalDOMTrees(parse('<p>hi</p>'), parse('<p>hi!</p>'))).toBe(false);
  });

  test('identical nested trees', () => {
    const html = '<ul id="list"><li>One <b>bold</b></li><li data-x="1">Two</li></ul><!-- end -->';
    expect(identicalDOMTrees(parse(html), parse(html))).toBe(true);
  });

  test('a node is identical to itself', () => {
    const tree = parse('<div><span>a</span></div>');
    expect(identicalDOMTrees(tree, tree)).toBe(true);
  });

  test('attributes: different values, missing or extra attributes differ', () => {
    expect(identicalDOMTrees(parse('<a href="/x" title="t"></a>'), parse('<a title="t" href="/x"></a>'))).toBe(true);
    expect(identicalDOMTrees(parse('<a href="/x"></a>'), parse('<a href="/y"></a>'))).toBe(false);
    expect(identicalDOMTrees(parse('<a href="/x"></a>'), parse('<a href="/x" target="_blank"></a>'))).toBe(false);
    expect(identicalDOMTrees(parse('<a href="/x" target="_blank"></a>'), parse('<a href="/x"></a>'))).toBe(false);
  });

  test('attributes: same count but different names differ', () => {
    expect(identicalDOMTrees(parse('<div id="a"></div>'), parse('<div title="a"></div>'))).toBe(false);
  });

  test('text: identical text matches, whitespace-only text counts', () => {
    expect(identicalDOMTrees(parse('<p>same</p>'), parse('<p>same</p>'))).toBe(true);
    expect(identicalDOMTrees(parse('<p> </p>'), parse('<p></p>'))).toBe(false);
    expect(identicalDOMTrees(parse('<p>Hi</p>'), parse('<p>hi</p>'))).toBe(false);
  });

  test('extra child: same structure matches, an extra child differs', () => {
    expect(identicalDOMTrees(parse('<ul><li>1</li><li>2</li></ul>'), parse('<ul><li>1</li><li>2</li></ul>'))).toBe(true);
    expect(identicalDOMTrees(parse('<ul><li>1</li></ul>'), parse('<ul><li>1</li><li>2</li></ul>'))).toBe(false);
    expect(identicalDOMTrees(parse('<ul><li>1</li><li>2</li></ul>'), parse('<ul><li>1</li></ul>'))).toBe(false);
  });

  test('tag: same tag matches, a different tag differs even with the same content', () => {
    expect(identicalDOMTrees(parse('<section><b>x</b></section>'), parse('<section><b>x</b></section>'))).toBe(true);
    expect(identicalDOMTrees(parse('<section><b>x</b></section>'), parse('<section><i>x</i></section>'))).toBe(false);
  });

  test('comments are compared too', () => {
    expect(identicalDOMTrees(parse('<!-- a --><p></p>'), parse('<!-- a --><p></p>'))).toBe(true);
    expect(identicalDOMTrees(parse('<!-- a --><p></p>'), parse('<!-- b --><p></p>'))).toBe(false);
    expect(identicalDOMTrees(parse('<!-- a --><p></p>'), parse('<p></p>'))).toBe(false);
  });

  test('different node types differ even with the same content', () => {
    const div = document.createElement('div');
    const text = document.createTextNode('x');
    const comment = document.createComment('x');
    expect(identicalDOMTrees(text, comment)).toBe(false);
    expect(identicalDOMTrees(div, text)).toBe(false);
    expect(identicalDOMTrees(document.createTextNode('x'), text)).toBe(true);
  });

  test('a difference deep in the tree is found', () => {
    const a = parse('<div><div><div><span data-v="1">deep</span></div></div></div>');
    const b = parse('<div><div><div><span data-v="2">deep</span></div></div></div>');
    expect(identicalDOMTrees(a, b)).toBe(false);
  });

  test('works on trees built with createElement', () => {
    const build = (attrs) => {
      const el = document.createElement('button');
      for (const [k, v] of attrs) el.setAttribute(k, v);
      el.appendChild(document.createTextNode('Go'));
      return el;
    };
    expect(identicalDOMTrees(build([['type', 'button'], ['disabled', '']]), build([['disabled', ''], ['type', 'button']]))).toBe(true);
  });
});
