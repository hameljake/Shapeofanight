import { SPACPerformance, Point } from '@/types';

// Layout helpers for different visualizations

export const layoutUMAP = (
  x: number,
  y: number,
  xScale: (val: number) => number,
  yScale: (val: number) => number
): Point => {
  return {
    x: xScale(x),
    y: yScale(y),
  };
};

export const layoutTimeline = (
  performance: SPACPerformance,
  slotScale: (val: number) => number,
  setYPositions: Record<string, number>
): Point => {
  return {
    x: slotScale(performance.slot_in_show),
    y: setYPositions[performance.set_label] || 0,
  };
};

export const layoutGrid = (
  index: number,
  cols: number,
  cellWidth: number,
  cellHeight: number,
  margin = { top: 50, left: 50 }
): Point => {
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  return {
    x: margin.left + col * cellWidth,
    y: margin.top + row * cellHeight,
  };
};

// Interpolate between two points (for transitions)
export const interpolatePoint = (
  from: Point,
  to: Point,
  t: number // 0-1
): Point => {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
};

// Easing functions
export const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutQuad = (t: number): number => {
  return 1 - (1 - t) * (1 - t);
};

