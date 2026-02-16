import { useState, useEffect, useMemo } from "react";

export type Breakpoint = "xxs" | "xs" | "s" | "m" | "l" | "xl";

export const BREAKPOINTS: Record<Breakpoint, number> = {
  xxs: 320,
  xs: 480,
  s: 768,
  m: 1024,
  l: 1440,
  xl: 1768,
};

const ORDERED_BREAKPOINTS: Breakpoint[] = ["xl", "l", "m", "s", "xs", "xxs"];

function getCurrentBreakpoint(width: number): Breakpoint {
  for (const bp of ORDERED_BREAKPOINTS) {
    if (width >= BREAKPOINTS[bp]) {
      return bp;
    }
  }
  return "xxs";
}

export interface UseBreakpointResult {
  breakpoint: Breakpoint;
  isBelow: (bp: Breakpoint) => boolean;
  isAbove: (bp: Breakpoint) => boolean;
  width: number;
}

const useBreakpoint = (): UseBreakpointResult => {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.innerWidth;
  });

  useEffect(() => {
    const queries = ORDERED_BREAKPOINTS.map((bp) => {
      const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`);
      const handler = () => setWidth(window.innerWidth);
      mql.addEventListener("change", handler);
      return { mql, handler };
    });

    setWidth(window.innerWidth);

    return () => {
      queries.forEach(({ mql, handler }) => mql.removeEventListener("change", handler));
    };
  }, []);

  const breakpoint = useMemo(() => getCurrentBreakpoint(width), [width]);

  const result = useMemo<UseBreakpointResult>(
    () => ({
      breakpoint,
      width,
      isBelow: (bp: Breakpoint) => width < BREAKPOINTS[bp],
      isAbove: (bp: Breakpoint) => width >= BREAKPOINTS[bp],
    }),
    [breakpoint, width],
  );

  return result;
};

export default useBreakpoint;
