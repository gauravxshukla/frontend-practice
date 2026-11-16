#!/usr/bin/env node
// Responsive audit: opens the app in a real browser at phone, tablet and desktop sizes and
// checks what Vitest (Node) can't: overflow, iOS zoom-on-focus, the mobile drawer, touch access
// (tap targets, keyboard hints, resize handles) and the phone question page's one-view-at-a-time layout.
// Uses the locally installed Chrome (or CHROME_PATH); nothing is downloaded.
//   npm run audit:responsive        Screenshots land in .audit/responsive/.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const OUT = '.audit/responsive';

const VIEWPORTS = [
  { name: 'phone-360', width: 360, height: 740, touch: true },
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-768', width: 768, height: 1024, touch: true },
  { name: 'tablet-1024', width: 1024, height: 768, touch: true },
  { name: 'desktop-1280', width: 1280, height: 800, touch: false },
];
/** Matches MOBILE_QUERY in src/lib/useMediaQuery.ts. */
const MOBILE_MAX = 860;

const ROUTES = [
  ['home', '/'],
  ['track', '/js'],
  ['topic', '/dsa/topics/1d-dp'],
  ['q-js', '/js/cancellable-interval'],
  ['q-dsa', '/dsa/climbing-stairs'],
  ['q-react', '/react/data-table'],
  ['q-native', '/react/data-table/native'],
  ['q-vanilla', '/vanilla/accordion'],
  ['quiz', '/quiz'],
  ['quiz-deck', '/quiz/js-output-promises'],
  ['notes', '/notes'],
  ['note', '/notes/javascript/dom-cheatsheet'],
];

/** Question routes, and whether they are code questions (Tests view) or machine coding (Preview view). */
const QUESTION_ROUTES = { 'q-js': true, 'q-dsa': true, 'q-react': false, 'q-native': false, 'q-vanilla': false };

const failures = [];
const fail = (vp, route, msg) => failures.push(`[${vp.name}] ${route}: ${msg}`);

async function launchBrowser() {
  const path = process.env.CHROME_PATH;
  try {
    return await chromium.launch(path ? { executablePath: path } : { channel: 'chrome' });
  } catch (e) {
    console.error(`Could not start Chrome (${e.message.split('\n')[0]}).\nInstall Google Chrome or set CHROME_PATH to a Chromium binary.`);
    process.exit(2);
  }
}

async function open(page, base, path) {
  await page.goto(new URL(path.slice(1), base).href, { waitUntil: 'load' });
  // Question pages lazy-load Sandpack and the editor; Sandpack never goes network-idle.
  if (/^\/(js|dsa|react|vanilla)\/[^/]+(\/native)?$/.test(path) && !path.includes('/topics/')) {
    await page.waitForSelector('.cm-content', { timeout: 20000 }).catch(() => {});
  }
  await page.waitForTimeout(600);
}

/** Page-level measurements; runs in the browser. */
function measure() {
  const vw = document.documentElement.clientWidth;
  const label = (el) => `${el.tagName.toLowerCase()}${el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : ''}`;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const editable = [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea, select, [contenteditable="true"]')]
    .filter(visible)
    .map((el) => ({ el: label(el), size: parseFloat(getComputedStyle(el).fontSize) }));
  // Inline text links (breadcrumbs, prose) are exempt, as in WCAG 2.5.8. Breadcrumb links are
  // flex items (so not display: inline) but are still text links in a line.
  const targets = [...document.querySelectorAll('button, a[href], [role=button], [role=tab], select, input:not([type=hidden])')]
    .filter((el) => {
      if (!visible(el) || getComputedStyle(el).display === 'inline' || el.closest('.breadcrumb')) return false;
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0 && (r.width < 32 || r.height < 32);
    })
    .map((el) => {
      const r = el.getBoundingClientRect();
      return `${label(el)}${el.getAttribute('aria-label') ? ` "${el.getAttribute('aria-label')}"` : ''} ${Math.round(r.width)}x${Math.round(r.height)}`;
    });
  return { overflow: document.documentElement.scrollWidth - vw, editable, smallTargets: [...new Set(targets)] };
}

/** Touch checks that apply to whatever is on screen: iOS zoom on focus and tap-target size. */
function checkTouch(vp, route, m) {
  const small = m.editable.filter((e) => e.size < 16);
  if (small.length) fail(vp, route, `controls under 16px zoom on iOS focus: ${small.map((e) => `${e.el} ${e.size}px`).join(', ')}`);
  if (m.smallTargets.length) fail(vp, route, `tap targets under 32px: ${m.smallTargets.join(', ')}`);
}

async function auditRoute(page, vp, route, path, base) {
  await open(page, base, path);
  const m = await page.evaluate(measure);
  if (m.overflow > 0) fail(vp, route, `page scrolls sideways by ${m.overflow}px`);
  if (vp.touch) {
    checkTouch(vp, route, m);
    const hints = await page.$$eval('.console-actions .kbd, .dashboard-search .kbd, .sidebar-search-trigger .kbd', (els) =>
      els.filter((el) => getComputedStyle(el).display !== 'none').length,
    );
    if (hints) fail(vp, route, `${hints} keyboard hint(s) shown on a touch screen`);
  }

  if (vp.width <= MOBILE_MAX) {
    const hidden = await page.$eval('.sidebar', (el) => getComputedStyle(el).visibility === 'hidden');
    if (!hidden) fail(vp, route, 'closed drawer is still visible (shadow sliver, reachable by Tab)');
  } else {
    const shown = await page.$eval('.sidebar', (el) => getComputedStyle(el).visibility !== 'hidden' && el.getBoundingClientRect().width > 0);
    const topbar = await page.$eval('.mobile-topbar', (el) => getComputedStyle(el).display);
    if (!shown) fail(vp, route, 'sidebar is hidden on a wide screen');
    if (topbar !== 'none') fail(vp, route, 'mobile top bar shows on a wide screen');
  }
  await page.screenshot({ path: `${OUT}/${vp.name}-${route}.png` });

  if (route in QUESTION_ROUTES && vp.width <= MOBILE_MAX) await auditPhoneQuestion(page, vp, route, QUESTION_ROUTES[route]);
  if (route === 'q-dsa' && vp.touch && vp.width > MOBILE_MAX) await auditHandles(page, vp, route);
}

const isShown = (page, selector) =>
  page.$$eval(selector, (els) =>
    els.some((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    }),
  );

/** What each phone view must show, and what it must hide. */
function viewSpec(pane, isCode) {
  switch (pane) {
    case 'Problem':
      return { shown: ['.prompt-panel'], hidden: ['.workspace-panel'] };
    case 'Code':
      return { shown: ['.workspace-panel .cm-editor'], hidden: ['.prompt-panel', isCode ? '.console-body' : '.mc-output'] };
    case 'Tests':
      return { shown: ['.console-body'], hidden: ['.prompt-panel', '.editor-area'] };
    default:
      return { shown: ['.mc-output', '.mc-output iframe'], hidden: ['.prompt-panel', '.mc-editor'] };
  }
}

/** Phone question page: one view at a time, full height, Run reachable, one-row header (+ More menu). */
async function auditPhoneQuestion(page, vp, route, isCode) {
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1);
  if (!fullHeight) fail(vp, route, 'question page scrolls vertically instead of filling the screen');

  const actionsHeight = await page.$eval('.question-actions', (el) => el.getBoundingClientRect().height);
  if (actionsHeight > 40) fail(vp, route, `header actions wrap onto several rows (${Math.round(actionsHeight)}px tall)`);

  const labels = await page.$$eval('.phone-panes [role=tab]', (els) => els.map((el) => el.textContent.trim()));
  const expected = ['Problem', 'Code', isCode ? 'Tests' : 'Preview'];
  if (labels.join() !== expected.join()) {
    fail(vp, route, `view switcher shows [${labels.join(', ')}], expected [${expected.join(', ')}]`);
    return;
  }

  for (const pane of expected) {
    await page.click(`.phone-panes [role=tab]:text-is("${pane}")`);
    await page.waitForTimeout(pane === 'Preview' ? 1500 : 300);
    const spec = viewSpec(pane, isCode);
    for (const sel of spec.shown) if (!(await isShown(page, sel))) fail(vp, `${route}/${pane}`, `${sel} is not visible`);
    for (const sel of spec.hidden) if (await isShown(page, sel)) fail(vp, `${route}/${pane}`, `${sel} should be hidden`);
    checkTouch(vp, `${route}/${pane}`, await page.evaluate(measure));
    await page.screenshot({ path: `${OUT}/${vp.name}-${route}-${pane.toLowerCase()}.png` });

    if (pane === 'Code' && isCode) {
      const run = page.locator('.console-actions button', { hasText: 'Run' });
      const submit = page.locator('.console-actions button', { hasText: 'Submit' });
      for (const [name, btn] of [['Run', run], ['Submit', submit]]) {
        const box = await btn.boundingBox();
        if (!box || box.y < 0 || box.y + box.height > vp.height) fail(vp, `${route}/Code`, `${name} is not on screen`);
      }
      await page.waitForSelector('.console-actions button:not([disabled])', { timeout: 15000 }).catch(() => {});
      await run.click();
      await page.waitForTimeout(300);
      const selected = await page.$eval('.phone-panes [aria-selected=true]', (el) => el.textContent.trim());
      if (selected !== 'Tests') fail(vp, `${route}/Code`, `Run left the view on ${selected}, expected Tests`);
    }
  }

  if (!isCode) {
    await page.click('.phone-panes [role=tab]:text-is("Problem")');
    const more = page.locator('[aria-label="More actions"]');
    if (!(await more.count())) {
      fail(vp, route, 'no "More actions" menu in the header');
      return;
    }
    await more.click();
    await page.waitForTimeout(200);
    const items = await page.$$eval('.header-menu button', (els) => els.map((el) => el.textContent.trim()).join(' | '));
    for (const want of ['Reset', 'Mark complete', 'solution']) {
      if (!items.includes(want)) fail(vp, route, `More menu lacks "${want}" (has: ${items})`);
    }
    await page.screenshot({ path: `${OUT}/${vp.name}-${route}-menu.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const closed = await page.evaluate(() => ({
      gone: !document.querySelector('.header-menu'),
      focus: document.activeElement?.getAttribute('aria-label') === 'More actions',
    }));
    if (!closed.gone) fail(vp, route, 'Esc did not close the More menu');
    if (!closed.focus) fail(vp, route, 'Esc did not return focus to "More actions"');
  }
}

/** Touch tablets keep the resize handles: a finger 8px off the line must still grab them. */
async function auditHandles(page, vp, route) {
  for (const [sel, axis] of [['.resize-handle', 'x'], ['.row-resize', 'y']]) {
    const hit = await page.evaluate(
      ([s, a]) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2 + (a === 'x' ? 8 : 0);
        const y = r.top + r.height / 2 + (a === 'y' ? 8 : 0);
        return document.elementFromPoint(x, y) === el;
      },
      [sel, axis],
    );
    if (hit === null) fail(vp, route, `${sel} not found`);
    else if (!hit) fail(vp, route, `${sel} is too thin to grab with a finger`);
  }
}

async function auditDrawer(page, vp, base) {
  await open(page, base, '/');
  await page.click('.mobile-topbar [aria-label="Open menu"]');
  await page.waitForTimeout(400);
  const open_ = await page.evaluate(() => ({
    inert: document.querySelector('.main')?.inert === true,
    locked: getComputedStyle(document.body).overflow === 'hidden',
    focusInDrawer: !!document.activeElement?.closest('.sidebar'),
  }));
  if (!open_.inert) fail(vp, 'drawer', 'page behind the open drawer is not inert');
  if (!open_.locked) fail(vp, 'drawer', 'page behind the open drawer still scrolls');
  if (!open_.focusInDrawer) fail(vp, 'drawer', 'focus did not move into the open drawer');
  await page.screenshot({ path: `${OUT}/${vp.name}-drawer.png` });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => ({
    focusOnMenu: document.activeElement?.getAttribute('aria-label') === 'Open menu',
    inert: document.querySelector('.main')?.inert === true,
  }));
  if (!closed.focusOnMenu) fail(vp, 'drawer', 'Esc did not return focus to "Open menu"');
  if (closed.inert) fail(vp, 'drawer', 'page stays inert after closing the drawer');
}

async function auditExplorer(page, vp, base) {
  await open(page, base, '/react/data-table');
  // Phones show one view at a time; the files live in the Code view.
  const codeTab = await page.$('.phone-panes [role=tab]:text-is("Code")');
  if (codeTab) await codeTab.click();
  const rail = await page.$('.explorer-rail [aria-label="Show files"]');
  if (rail) {
    await rail.click();
    await page.waitForTimeout(300);
  }
  const shown = await page.$$eval('.explorer-item-actions', (els) => els.length > 0 && els.some((el) => getComputedStyle(el).display !== 'none'));
  if (!shown) fail(vp, 'explorer', 'rename/delete are hover-only, unreachable by touch');
}

mkdirSync(OUT, { recursive: true });
const server = await createServer({ logLevel: 'error', server: { port: 5199 } });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await launchBrowser();

try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.touch,
      hasTouch: vp.touch,
    });
    const page = await context.newPage();
    for (const [route, path] of ROUTES) await auditRoute(page, vp, route, path, base);
    if (vp.width <= MOBILE_MAX) await auditDrawer(page, vp, base);
    if (vp.touch) await auditExplorer(page, vp, base);
    await context.close();
    console.log(`checked ${vp.name}`);
  }
} finally {
  await browser.close();
  await server.close();
}

if (failures.length) {
  console.log(`\n${failures.length} failure(s):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`\nResponsive audit passed. Screenshots in ${OUT}/`);
