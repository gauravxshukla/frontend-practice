#!/usr/bin/env node
// Responsive audit: opens the app in a real browser at phone, tablet and desktop sizes and
// checks what Vitest (Node) can't: overflow, iOS zoom-on-focus, the mobile drawer, touch access.
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

const failures = [];
const warnings = [];
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
  const targets = [...document.querySelectorAll('button, a[href], [role=button], [role=tab], select, input')].filter((el) => {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && (r.width < 32 || r.height < 32);
  }).length;
  return { overflow: document.documentElement.scrollWidth - vw, editable, smallTargets: targets };
}

async function auditRoute(page, vp, route, path, base) {
  await open(page, base, path);
  const m = await page.evaluate(measure);
  if (m.overflow > 0) fail(vp, route, `page scrolls sideways by ${m.overflow}px`);
  if (vp.touch) {
    const small = m.editable.filter((e) => e.size < 16);
    if (small.length) fail(vp, route, `controls under 16px zoom on iOS focus: ${small.map((e) => `${e.el} ${e.size}px`).join(', ')}`);
  }
  if (m.smallTargets) warnings.push(`[${vp.name}] ${route}: ${m.smallTargets} tap targets under 32px in view`);

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

if (warnings.length) console.log(`\nWarnings (not failing):\n  ${warnings.join('\n  ')}`);
if (failures.length) {
  console.log(`\n${failures.length} failure(s):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`\nResponsive audit passed. Screenshots in ${OUT}/`);
