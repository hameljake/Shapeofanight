import React, { useEffect, useMemo, useState } from 'react';
import { SceneProps, JamLevel } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawGlow, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales, jamGlowScale } from '@/utils/scales';

const Scene5Jams: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();
  const [minJam, setMinJam] = useState<JamLevel>(0);

  const jamLookup = data.jam_levels_by_perf || {};
  const galaxy = data.galaxy || [];

  const filteredNodes = useMemo(() => {
    if (!galaxy.length) return [] as typeof galaxy;
    return galaxy.filter((node) => {
      const jl = jamLookup[node.perf_id] ?? 0;
      return jl >= minJam;
    });
  }, [galaxy, jamLookup, minJam]);

  useEffect(() => {
    if (!ctx || !data.galaxy || !data.jam_levels_by_perf) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Base galaxy dots (faded in by progress)
    setGlobalAlpha(ctx, 0.25 + 0.35 * progress);
    data.galaxy.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      drawCircle(ctx, { x, y }, 1.2, 'rgba(170, 170, 170, 0.6)');
    });
    resetGlobalAlpha(ctx);

    // Jam glow layer for nodes meeting minJam
    const maxRadiusPx = Math.min(width, height) * 0.045; // capped radius relative to screen
    filteredNodes.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      const jl = jamLookup[node.perf_id] ?? 0;
      const intensity = jamGlowScale(jl) * (0.85 * progress);
      if (intensity <= 0) return;

      // Color: warm orange for low jams to hot red for highest
      const color = jl >= 3 ? '#ef4444' : jl === 2 ? '#f97316' : jl === 1 ? '#fde047' : '#ffffff';

      // Radius: scale slightly by jam level and screen size
      const radius = (0.25 + jl * 0.25) * maxRadiusPx;
      drawGlow(ctx, { x, y }, radius, color, intensity);
    });

    // Draw small bright cores on filtered nodes for focus
    setGlobalAlpha(ctx, Math.min(0.9, 0.4 + 0.4 * progress));
    filteredNodes.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      drawCircle(ctx, { x, y }, 1.6, 'rgba(255, 255, 255, 0.9)');
    });
    resetGlobalAlpha(ctx);
  }, [ctx, data, filteredNodes, jamLookup, progress]);

  // Simple inline control overlay in SVG layer via portals not necessary; render local control here for now
  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={16} y={16} width={260} height={56} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '8px 10px',
          color: 'var(--color-text, #eee)',
          font: '12px system-ui',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ opacity: 0.85 }}>Min jam level:</span>
            <select
              value={minJam}
              onChange={(e) => setMinJam(parseInt(e.target.value, 10) as JamLevel)}
              style={{
                background: 'rgba(0,0,0,0.35)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                padding: '4px 8px'
              }}
            >
              <option value={0}>0 — all</option>
              <option value={1}>1 — light</option>
              <option value={2}>2 — deep</option>
              <option value={3}>3 — monster</option>
            </select>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene5Jams;

