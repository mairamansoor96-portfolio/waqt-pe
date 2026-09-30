"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shows a sheet exactly as it will print, scaled to fit the screen. In print
 * the scaling is removed (see .sheet-scale in globals.css), so the sheet
 * prints at its true size in mm.
 */
export function SheetFrame({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const natural = inner.current.scrollWidth;
      const s = natural ? Math.min(1, outer.current.clientWidth / natural) : 1;
      setScale(s);
      setHeight(inner.current.scrollHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="sheet-scale-outer w-full overflow-hidden" style={{ height }}>
      <div ref={inner} className="sheet-scale w-max origin-top-left rtl:origin-top-right" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
