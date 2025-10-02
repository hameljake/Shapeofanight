import { Point } from '@/types';

// Canvas rendering utilities

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  fillColor: string,
  strokeColor?: string,
  strokeWidth?: number
) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  width: number,
  alpha = 1
) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.restore();
};

export const drawGlow = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  color: string,
  intensity: number
) => {
  const gradient = ctx.createRadialGradient(
    point.x, point.y, 0,
    point.x, point.y, radius
  );
  
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  const colorStart = color.length === 7 ? color + alpha : color;
  const colorEnd = color.length === 7 ? color + '00' : color.slice(0, -2) + '00';
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  ctx.fill();
};

export const setGlobalAlpha = (ctx: CanvasRenderingContext2D, alpha: number) => {
  ctx.globalAlpha = alpha;
};

export const resetGlobalAlpha = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = 1;
};

// Batch rendering for performance
export const drawCircles = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  radius: number,
  fillColor: string
) => {
  ctx.fillStyle = fillColor;
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  });
};

