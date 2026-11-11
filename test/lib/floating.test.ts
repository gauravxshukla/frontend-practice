import { describe, expect, it } from 'vitest';
import { placeFloating } from '../../src/lib/floating';

const viewport = { width: 1000, height: 800 };
const anchor = { left: 400, top: 300, width: 100, height: 40 };
const size = { width: 120, height: 30 };

describe('placeFloating', () => {
  it('places on each side, centred on the anchor', () => {
    expect(placeFloating(anchor, size, 'bottom', viewport)).toEqual({ x: 390, y: 346, side: 'bottom' });
    expect(placeFloating(anchor, size, 'top', viewport)).toEqual({ x: 390, y: 264, side: 'top' });
    expect(placeFloating(anchor, size, 'right', viewport)).toEqual({ x: 506, y: 305, side: 'right' });
    expect(placeFloating(anchor, size, 'left', viewport)).toEqual({ x: 274, y: 305, side: 'left' });
  });

  it('flips to the opposite side when there is no room', () => {
    const atBottom = { ...anchor, top: 770 };
    expect(placeFloating(atBottom, size, 'bottom', viewport).side).toBe('top');
    const atRight = { ...anchor, left: 940, width: 40 };
    expect(placeFloating(atRight, size, 'right', viewport).side).toBe('left');
  });

  it('keeps the preferred side when neither side has room on the main axis', () => {
    const tall = { width: 120, height: 500 };
    expect(placeFloating(anchor, tall, 'bottom', viewport).side).toBe('bottom');
  });

  it('clamps along the cross axis near the viewport edge', () => {
    const nearRight = { left: 960, top: 300, width: 30, height: 30 };
    expect(placeFloating(nearRight, size, 'bottom', viewport).x).toBe(1000 - 8 - 120);
    const nearLeft = { left: 0, top: 300, width: 20, height: 30 };
    expect(placeFloating(nearLeft, size, 'bottom', viewport).x).toBe(8);
  });

  it('aligns to the anchor\'s start edge, still clamped', () => {
    expect(placeFloating(anchor, size, 'right', viewport, 8, 'start')).toEqual({ x: 508, y: 300, side: 'right' });
    const low = { ...anchor, top: 790 };
    expect(placeFloating(low, size, 'right', viewport, 8, 'start').y).toBe(800 - 8 - 30);
  });

  it('pins to the margin when the element is larger than the viewport', () => {
    const huge = { width: 2000, height: 2000 };
    const { x, y } = placeFloating(anchor, huge, 'bottom', viewport);
    expect(x).toBe(8);
    expect(y).toBe(8);
  });
});
