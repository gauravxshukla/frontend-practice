import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Markdown from '../../src/components/Markdown';

const TABLE = '| Method | Returns |\n| --- | --- |\n| `querySelector` | the first match |\n';

describe('Markdown', () => {
  it('wraps tables in a scroll box so wide ones never widen the page', () => {
    const html = renderToStaticMarkup(createElement(Markdown, { children: TABLE }));
    expect(html).toContain('<div class="table-scroll"><table>');
  });

  it('leaves other content unwrapped', () => {
    const html = renderToStaticMarkup(createElement(Markdown, { children: 'Just *text*.' }));
    expect(html).not.toContain('table-scroll');
  });
});
