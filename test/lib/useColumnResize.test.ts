import { describe, expect, it } from 'vitest';
import { clampColumn } from '../../src/lib/useColumnResize';

const px = { unit: 'px', min: 300, max: 0.6 } as const;
const fraction = { unit: 'fraction', min: 0.3, max: 0.7 } as const;

describe('clampColumn', () => {
  it('keeps a pixel width between the minimum and a share of the container', () => {
    expect(clampColumn(420, 1200, px, 400)).toBe(420);
    expect(clampColumn(120, 1200, px, 400)).toBe(300);
    expect(clampColumn(900, 1200, px, 400)).toBe(720);
    expect(clampColumn(420.6, 1200, px, 400)).toBe(421);
  });

  it('gives a container narrower than the minimum the minimum', () => {
    expect(clampColumn(400, 350, px, 400)).toBe(300);
  });

  it('keeps a fraction within its bounds, whatever the container', () => {
    expect(clampColumn(0.5, 1000, fraction, 0.5)).toBe(0.5);
    expect(clampColumn(0.1, 1000, fraction, 0.5)).toBe(0.3);
    expect(clampColumn(0.95, 10, fraction, 0.5)).toBe(0.7);
  });

  it('falls back to the default for unreadable stored values', () => {
    expect(clampColumn('wide', 1000, fraction, 0.5)).toBe(0.5);
    expect(clampColumn(Number.NaN, 1000, px, 400)).toBe(400);
    expect(clampColumn(null, 1000, px, 400)).toBe(400);
  });
});
