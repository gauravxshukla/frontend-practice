import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Logical phone screen (iPhone 14-ish) and the bezel drawn around it. */
const SCREEN = { width: 390, height: 844 };
const BEZEL = 12;
const MARGIN = 16;

/**
 * Renders children at phone size, scaled down to fit the pane. The screen
 * keeps its real 390×844 layout, so the app's flexbox behaves like on a device.
 */
export default function DeviceFrame({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const fit = () => {
      const w = (area.clientWidth - MARGIN * 2) / (SCREEN.width + BEZEL * 2);
      const h = (area.clientHeight - MARGIN * 2) / (SCREEN.height + BEZEL * 2);
      setScale(Math.max(0.2, Math.min(1, w, h)));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const style = {
    '--screen-w': `${SCREEN.width}px`,
    '--screen-h': `${SCREEN.height}px`,
    '--bezel': `${BEZEL}px`,
    '--scale': scale,
  } as CSSProperties;

  return (
    <div ref={areaRef} className="device-area">
      <div className="device-frame" style={style}>
        <div className="device-screen">{children}</div>
      </div>
    </div>
  );
}
