import getElementsByTagName from './solution.js';

/** Builds a fresh fixture inside <body> and returns its root element. */
function render(html) {
  document.body.innerHTML = html;
  return document.body;
}

const ids = (elements) => elements.map((el) => el.id);

describe('getElementsByTagName', () => {
  test('example: finds matching descendants in document order', () => {
    const root = render(`
      <div id="a">
        <span id="b"></span>
        <div id="c"><span id="d"></span></div>
      </div>`);
    expect(ids(getElementsByTagName(root, 'span'))).toEqual(['b', 'd']);
  });

  test('example: matching is case-insensitive', () => {
    const root = render(`
      <div id="a">
        <span id="b"></span>
        <div id="c"><span id="d"></span></div>
      </div>`);
    expect(ids(getElementsByTagName(root, 'DIV'))).toEqual(['a', 'c']);
    expect(ids(getElementsByTagName(root, 'Div'))).toEqual(['a', 'c']);
  });

  test("'*' matches every descendant element in document order", () => {
    const root = render(`
      <section id="1"><p id="2"><b id="3"></b></p><i id="4"></i></section>
      <footer id="5"></footer>`);
    expect(ids(getElementsByTagName(root, '*'))).toEqual(['1', '2', '3', '4', '5']);
  });

  test('does not include the starting element itself', () => {
    render(`<div id="root"><div id="child"></div></div>`);
    const root = document.getElementById('root');
    expect(ids(getElementsByTagName(root, 'div'))).toEqual(['child']);
  });

  test('finds deeply nested matches', () => {
    const root = render(`<div><div><div><div><a id="deep"></a></div></div></div></div><a id="shallow"></a>`);
    expect(ids(getElementsByTagName(root, 'a'))).toEqual(['deep', 'shallow']);
  });

  test('does not match tag-name prefixes', () => {
    const root = render(`<b id="b"></b><br id="br"><button id="btn"></button>`);
    expect(ids(getElementsByTagName(root, 'b'))).toEqual(['b']);
  });

  test('skips text and comment nodes', () => {
    const root = render(`text <!-- p --><p id="a">hi</p>`);
    expect(ids(getElementsByTagName(root, '*'))).toEqual(['a']);
  });

  test('returns [] when nothing matches or there are no children', () => {
    const root = render(`<div id="a"></div>`);
    expect(getElementsByTagName(root, 'span')).toEqual([]);
    expect(getElementsByTagName(document.getElementById('a'), '*')).toEqual([]);
  });

  test('returns a real array and does not use the native methods', () => {
    const root = render(`<p id="a"></p>`);
    const native = jest.spyOn(root, 'getElementsByTagName');
    const qsa = jest.spyOn(root, 'querySelectorAll');
    const result = getElementsByTagName(root, 'p');
    expect(Array.isArray(result)).toBe(true);
    expect(native).not.toHaveBeenCalled();
    expect(qsa).not.toHaveBeenCalled();
    native.mockRestore();
    qsa.mockRestore();
  });
});
