import delegate from './solution.js';

/** Builds a fresh fixture inside <body> and returns its root element. */
function render(html) {
  document.body.innerHTML = html;
  return document.body;
}

const click = (el) => el.dispatchEvent(new Event('click', { bubbles: true }));

const LIST = `
  <ul id="list">
    <li class="item" id="one"><span id="label">One</span></li>
    <li class="item" id="two">Two</li>
    <li id="plain">Plain</li>
  </ul>
  <li class="item" id="outside">Outside</li>`;

describe('delegate', () => {
  test('example: a click inside a matching element calls handler with the event and the match', () => {
    render(LIST);
    const list = document.getElementById('list');
    let targetId;
    const handler = jest.fn((event) => {
      targetId = event.target.id; // read during dispatch
    });
    delegate(list, 'click', '.item', handler);
    click(document.getElementById('label'));
    expect(handler).toHaveBeenCalledTimes(1);
    const [event, match] = handler.mock.calls[0];
    expect(event.type).toBe('click');
    expect(targetId).toBe('label');
    expect(match.id).toBe('one');
  });

  test('example: the unsubscribe function removes the listener', () => {
    render(LIST);
    const list = document.getElementById('list');
    const handler = jest.fn();
    const stop = delegate(list, 'click', '.item', handler);
    stop();
    click(document.getElementById('two'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('attaches exactly one listener to root', () => {
    render(LIST);
    const list = document.getElementById('list');
    const spy = jest.spyOn(list, 'addEventListener');
    delegate(list, 'click', '.item', () => {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe('click');
    spy.mockRestore();
  });

  test('sets this to the matched element', () => {
    render(LIST);
    let seen;
    delegate(document.getElementById('list'), 'click', '.item', function () {
      seen = this;
    });
    click(document.getElementById('two'));
    expect(seen).toBe(document.getElementById('two'));
  });

  test('ignores events on elements that do not match', () => {
    render(LIST);
    const handler = jest.fn();
    delegate(document.getElementById('list'), 'click', '.item', handler);
    click(document.getElementById('plain'));
    click(document.getElementById('list'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('ignores matching elements outside root', () => {
    render(LIST);
    const handler = jest.fn();
    delegate(document.getElementById('list'), 'click', '.item', handler);
    click(document.getElementById('outside'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('does not match root itself or an ancestor above root', () => {
    render(`<div class="box" id="outer"><div class="box" id="root"><p id="p">text</p></div></div>`);
    const handler = jest.fn();
    delegate(document.getElementById('root'), 'click', '.box', handler);
    click(document.getElementById('p'));
    click(document.getElementById('root'));
    expect(handler).not.toHaveBeenCalled();
  });

  test('with nested matches only the closest one fires', () => {
    render(`<div id="root"><div class="item" id="outer"><div class="item" id="inner"><b id="b">x</b></div></div></div>`);
    const handler = jest.fn();
    delegate(document.getElementById('root'), 'click', '.item', handler);
    click(document.getElementById('b'));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1].id).toBe('inner');
  });

  test('works for children added after delegate was called', () => {
    render(LIST);
    const list = document.getElementById('list');
    const handler = jest.fn();
    delegate(list, 'click', '.item', handler);
    const li = document.createElement('li');
    li.className = 'item';
    li.id = 'new';
    list.appendChild(li);
    click(li);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(li);
  });

  test('only handles the given event type', () => {
    render(LIST);
    const handler = jest.fn();
    delegate(document.getElementById('list'), 'click', '.item', handler);
    document.getElementById('two').dispatchEvent(new Event('input', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  test('separate delegations are independent', () => {
    render(LIST);
    const list = document.getElementById('list');
    const a = jest.fn();
    const b = jest.fn();
    const stopA = delegate(list, 'click', '.item', a);
    delegate(list, 'click', 'span', b);
    stopA();
    click(document.getElementById('label'));
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});
