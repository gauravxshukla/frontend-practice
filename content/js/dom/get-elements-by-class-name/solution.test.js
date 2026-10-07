import getElementsByClassName from './solution.js';

/** Builds a fresh fixture inside <body> and returns its root element. */
function render(html) {
  document.body.innerHTML = html;
  return document.body;
}

const ids = (elements) => elements.map((el) => el.id);

describe('getElementsByClassName', () => {
  test('example: matches a single class', () => {
    const root = render(`
      <div id="a" class="item"></div>
      <div id="b" class="other"></div>
      <div id="c" class="item"></div>`);
    expect(ids(getElementsByClassName(root, 'item'))).toEqual(['a', 'c']);
  });

  test('example: requires every class, in any order', () => {
    const root = render(`
      <div id="a" class="card active">
        <p id="b" class="active">One</p>
        <section id="c" class="card"><span id="d" class="active card">Two</span></section>
      </div>`);
    expect(ids(getElementsByClassName(root, 'card active'))).toEqual(['a', 'd']);
  });

  test('returns elements in document (pre-order) order', () => {
    const root = render(`
      <div id="1" class="x">
        <div id="2" class="x"><div id="3" class="x"></div></div>
        <div id="4" class="x"></div>
      </div>
      <div id="5" class="x"></div>`);
    expect(ids(getElementsByClassName(root, 'x'))).toEqual(['1', '2', '3', '4', '5']);
  });

  test('does not include the starting element itself', () => {
    render(`<div id="root" class="x"><span id="child" class="x"></span></div>`);
    const root = document.getElementById('root');
    expect(ids(getElementsByClassName(root, 'x'))).toEqual(['child']);
  });

  test('matches whole class names only, case-sensitively', () => {
    const root = render(`
      <div id="a" class="active"></div>
      <div id="b" class="act"></div>
      <div id="c" class="Act"></div>`);
    expect(ids(getElementsByClassName(root, 'act'))).toEqual(['b']);
  });

  test('ignores extra whitespace in the query and in class attributes', () => {
    const root = render(`<div id="a" class="  foo
      bar  "></div><div id="b" class="foo"></div>`);
    expect(ids(getElementsByClassName(root, '\t bar   foo \n'))).toEqual(['a']);
  });

  test('returns [] for an empty or blank query', () => {
    const root = render(`<div id="a" class="x"></div>`);
    expect(getElementsByClassName(root, '')).toEqual([]);
    expect(getElementsByClassName(root, '   ')).toEqual([]);
  });

  test('returns [] when nothing matches or there are no children', () => {
    const root = render(`<div id="a" class="x"></div>`);
    expect(getElementsByClassName(root, 'y')).toEqual([]);
    expect(getElementsByClassName(document.getElementById('a'), 'x')).toEqual([]);
  });

  test('skips text and comment nodes, and elements without a class', () => {
    const root = render(`text <!-- note --><p id="a">no class</p><p id="b" class="x">yes</p>`);
    expect(ids(getElementsByClassName(root, 'x'))).toEqual(['b']);
  });

  test('returns a real array', () => {
    const root = render(`<i class="x"></i>`);
    expect(Array.isArray(getElementsByClassName(root, 'x'))).toBe(true);
  });
});
