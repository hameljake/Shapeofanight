import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { Role } from '@/types';

// UMAP coordinate scales (adjust based on your data range)
export const createUMAPScales = (
  width: number,
  height: number,
  margin = { top: 50, right: 50, bottom: 50, left: 50 }
) => {
  // UMAP coordinates are in [0,1] range
  const xScale = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top]);

  return { xScale, yScale };
};

// Timeline scale (horizontal layout by slot)
export const createTimelineScale = (
  width: number,
  maxSlots: number,
  margin = { left: 100, right: 100 }
) => {
  return scaleLinear()
    .domain([0, maxSlots])
    .range([margin.left, width - margin.right]);
};

// Role color scale
export const roleColorScale = scaleOrdinal<Role, string>()
  .domain(['opener', 'centerpiece', 'landing', 'closer', 'encore', 'other'])
  .range([
    '#4a9eff', // opener - bright blue
    '#ff4a4a', // centerpiece - bright red
    '#4aff4a', // landing - bright green
    '#ffd700', // closer - gold
    '#ff69b4', // encore - hot pink
    '#a0a0a0', // other - gray
  ]);

// Era color scale
export const eraColorScale = scaleOrdinal<string, string>()
  .domain(['1.0', '2.0', '3.0', '4.0'])
  .range([
    'var(--color-era-1)',
    'var(--color-era-2)',
    'var(--color-era-3)',
    'var(--color-era-4)',
  ]);

// Jam level to glow intensity
export const jamGlowScale = scaleLinear()
  .domain([0, 3])
  .range([0, 1]);

// Energy score to color intensity
export const energyColorScale = scaleLinear<string>()
  .domain([-3, 0, 3])
  .range(['#3b82f6', '#fbbf24', '#ef4444']);

