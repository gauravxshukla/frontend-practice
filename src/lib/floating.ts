export type Side = 'top' | 'bottom' | 'left' | 'right';

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const MARGIN = 8;

export type Align = 'center' | 'start';

function position(anchor: RectLike, size: Size, side: Side, gap: number, align: Align) {
  const centerX = align === 'start' ? anchor.left : anchor.left + anchor.width / 2 - size.width / 2;
  const centerY = align === 'start' ? anchor.top : anchor.top + anchor.height / 2 - size.height / 2;
  switch (side) {
    case 'top':
      return { x: centerX, y: anchor.top - gap - size.height };
    case 'bottom':
      return { x: centerX, y: anchor.top + anchor.height + gap };
    case 'left':
      return { x: anchor.left - gap - size.width, y: centerY };
    case 'right':
      return { x: anchor.left + anchor.width + gap, y: centerY };
  }
}

function fits({ x, y }: { x: number; y: number }, size: Size, viewport: Size) {
  return x >= MARGIN && y >= MARGIN && x + size.width <= viewport.width - MARGIN && y + size.height <= viewport.height - MARGIN;
}

const clamp = (value: number, max: number) => Math.max(MARGIN, Math.min(value, max - MARGIN));

/**
 * Where to put a floating element (tooltip, flyout) next to an anchor: on the
 * preferred side, flipped to the opposite side if it would overflow there and fits
 * on the other, then nudged inside the viewport. Coordinates are viewport pixels.
 * `start` aligns its top (or left) edge with the anchor's instead of centring.
 */
export function placeFloating(anchor: RectLike, size: Size, side: Side, viewport: Size, gap = 6, align: Align = 'center') {
  let chosen = side;
  let point = position(anchor, size, side, gap, align);
  if (!fits(point, size, viewport)) {
    const flipped = position(anchor, size, OPPOSITE[side], gap, align);
    const mainAxisOk = (s: Side, p: { x: number; y: number }) =>
      s === 'top' || s === 'bottom'
        ? p.y >= MARGIN && p.y + size.height <= viewport.height - MARGIN
        : p.x >= MARGIN && p.x + size.width <= viewport.width - MARGIN;
    if (!mainAxisOk(side, point) && mainAxisOk(OPPOSITE[side], flipped)) {
      chosen = OPPOSITE[side];
      point = flipped;
    }
  }
  return {
    x: clamp(point.x, Math.max(MARGIN, viewport.width - size.width)),
    y: clamp(point.y, Math.max(MARGIN, viewport.height - size.height)),
    side: chosen,
  };
}
