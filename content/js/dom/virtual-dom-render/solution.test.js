import render from './solution.js';

describe('render', () => {
  test('example: renders an element with props and nested children', () => {
    const el = render({
      type: 'button',
      props: { className: 'primary' },
      children: ['Save ', { type: 'b', children: [3] }],
    });
    expect(el.outerHTML).toBe('<button class="primary">Save <b>3</b></button>');
  });

  test('example: onClick props become click listeners', () => {
    const onClick = jest.fn();
    const el = render({ type: 'button', props: { onClick }, children: ['Go'] });
    el.dispatchEvent(new Event('click'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].type).toBe('click');
    expect(el.outerHTML).toBe('<button>Go</button>');
  });

  test('strings and numbers become text nodes', () => {
    const text = render('hello');
    expect(text.nodeType).toBe(3);
    expect(text.textContent).toBe('hello');
    const num = render(42);
    expect(num.nodeType).toBe(3);
    expect(num.textContent).toBe('42');
  });

  test('a string containing markup stays text', () => {
    const el = render({ type: 'p', children: ['<b>bold</b>'] });
    expect(el.childNodes).toHaveLength(1);
    expect(el.childNodes[0].nodeType).toBe(3);
    expect(el.children).toHaveLength(0);
    expect(el.textContent).toBe('<b>bold</b>');
    expect(el.outerHTML).toBe('<p>&lt;b&gt;bold&lt;/b&gt;</p>');
  });

  test('other props become attributes', () => {
    const el = render({ type: 'a', props: { href: '/home', id: 'link', 'aria-label': 'Home', tabIndex: 2 } });
    expect(el.getAttribute('href')).toBe('/home');
    expect(el.getAttribute('id')).toBe('link');
    expect(el.getAttribute('aria-label')).toBe('Home');
    expect(el.getAttribute('tabIndex')).toBe('2');
  });

  test('props and children are optional', () => {
    expect(render({ type: 'div' }).outerHTML).toBe('<div></div>');
    expect(render({ type: 'div', props: null, children: null }).outerHTML).toBe('<div></div>');
  });

  test('style objects set individual style properties', () => {
    const el = render({ type: 'div', props: { style: { color: 'red', fontSize: '12px' } } });
    expect(el.style.color).toBe('red');
    expect(el.style.fontSize).toBe('12px');
  });

  test('true sets an empty attribute; false, null and undefined set nothing', () => {
    const el = render({
      type: 'input',
      props: { disabled: true, hidden: false, title: null, alt: undefined, 'data-count': 0 },
    });
    expect(el.getAttribute('disabled')).toBe('');
    expect(el.hasAttribute('hidden')).toBe(false);
    expect(el.hasAttribute('title')).toBe(false);
    expect(el.hasAttribute('alt')).toBe(false);
    expect(el.getAttribute('data-count')).toBe('0');
  });

  test('skips null, undefined and boolean children but renders 0', () => {
    const el = render({ type: 'ul', children: [null, 'a', undefined, false, true, 0, { type: 'li' }] });
    expect(el.outerHTML).toBe('<ul>a0<li></li></ul>');
  });

  test('renders deeply nested children in order', () => {
    const el = render({
      type: 'section',
      props: { id: 'root' },
      children: [
        { type: 'h1', children: ['Title'] },
        { type: 'ul', children: [{ type: 'li', children: ['1'] }, { type: 'li', children: [{ type: 'a', props: { href: '/x' }, children: ['2'] }] }] },
      ],
    });
    expect(el.outerHTML).toBe('<section id="root"><h1>Title</h1><ul><li>1</li><li><a href="/x">2</a></li></ul></section>');
  });

  test('event props use the lower-cased event name, and clicks on children bubble to them', () => {
    const onClick = jest.fn();
    const onMouseDown = jest.fn();
    const el = render({ type: 'div', props: { onClick, onMouseDown }, children: [{ type: 'span', children: ['x'] }] });
    el.firstChild.dispatchEvent(new Event('click', { bubbles: true }));
    el.dispatchEvent(new Event('mousedown'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(el.hasAttribute('onclick')).toBe(false);
  });

  test('does not mutate the vnode', () => {
    const vnode = { type: 'p', props: { className: 'x' }, children: ['a', { type: 'b', children: ['c'] }] };
    const copy = JSON.parse(JSON.stringify(vnode));
    render(vnode);
    expect(vnode).toEqual(copy);
  });
});
