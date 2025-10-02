import React, { useEffect, useMemo } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawLine, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales, eraColorScale } from '@/utils/scales';
import { easeInOutCubic } from '@/utils/layout';

const Scene6Eras: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  // Normalize song_trails: it may be an object map in JSON
  const trailsArray = useMemo(() => {
    const raw = (data.song_trails as any) || [];
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      return Object.entries(raw).map(([song_slug, trail]) => ({ song_slug, trail })) as Array<{
        song_slug: string;
        trail: Array<{ era_label: string; x: number; y: number; n: number }>;
      }>;
    }
    return [] as Array<{
      song_slug: string;
      trail: Array<{ era_label: string; x: number; y: number; n: number }>;
    }>;
  }, [data.song_trails]);

  // Map verbose era labels to scale keys ('1.0','2.0','3.0','4.0')
  const getEraKey = (label: string): string | null => {
    if (!label) return null;
    if (label.includes('1.0')) return '1.0';
    if (label.includes('2.0')) return '2.0';
    if (label.includes('3.0')) return '3.0';
    if (label.includes('4.0')) return '4.0';
    return null; // e.g., Other/Hiatus
  };

  // Limit number of trails for performance on large datasets
  const visibleTrails = useMemo(() => {
    const maxTrails = 500; // cap to avoid overdraw
    if (trailsArray.length <= maxTrails) return trailsArray;
    const step = Math.ceil(trailsArray.length / maxTrails);
    return trailsArray.filter((_, i) => i % step === 0);
  }, [trailsArray]);

  useEffect(() => {
    if (!ctx || !trailsArray.length) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Animate reveal along each trail with eased progress
    const t = easeInOutCubic(Math.max(0, Math.min(progress, 1)));

    // Draw trails
    setGlobalAlpha(ctx, 0.85);
    visibleTrails.forEach((trail) => {
      const points = trail.trail.map((p) => ({ x: xScale(p.x), y: yScale(p.y), era: p.era_label }));
      if (points.length < 2) return;

      const totalSegments = points.length - 1;
      const segmentsToDraw = Math.max(1, Math.floor(totalSegments * t));
      const partial = totalSegments * t - segmentsToDraw;

      for (let i = 0; i < segmentsToDraw; i++) {
        const from = points[i];
        const to = points[i + 1];
        const eraKey = getEraKey(String(to.era));
        const color = eraKey ? eraColorScale(eraKey) : '#888888';
        const widthPx = 1 + Math.min(2, i * 0.05);
        drawLine(ctx, { x: from.x, y: from.y }, { x: to.x, y: to.y }, color, widthPx, 0.7);
      }

      // Draw partial segment for smooth animation
      if (segmentsToDraw < totalSegments) {
        const from = points[segmentsToDraw];
        const to = points[segmentsToDraw + 1];
        const eraKey = getEraKey(String(to.era));
        const color = eraKey ? eraColorScale(eraKey) : '#888888';
        const x = from.x + (to.x - from.x) * partial;
        const y = from.y + (to.y - from.y) * partial;
        drawLine(ctx, { x: from.x, y: from.y }, { x, y }, color, 1.25, 0.7);
      }
    });
    resetGlobalAlpha(ctx);

    // Draw endpoints as subtle nodes
    setGlobalAlpha(ctx, 0.75);
    visibleTrails.forEach((trail) => {
      const last = trail.trail[trail.trail.length - 1];
      if (!last) return;
      const x = xScale(last.x);
      const y = yScale(last.y);
      const eraKey = getEraKey(String(last.era_label));
      const color = eraKey ? eraColorScale(eraKey) : '#888888';
      drawCircle(ctx, { x, y }, 2, color);
    });
    resetGlobalAlpha(ctx);
  }, [ctx, visibleTrails, trailsArray, progress]);

  if (!isActive) return null;

  // Legend overlay
  return (
    <g>
      <foreignObject x={16} y={16} width={260} height={74} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '8px 10px',
          color: 'var(--color-text, #eee)',
          font: '12px system-ui',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{ marginBottom: 6, opacity: 0.9 }}>Era drift</div>
          {['1.0','2.0','3.0','4.0'].map((era) => (
            <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                display: 'inline-block',
                width: 18,
                height: 3,
                background: eraColorScale(era)
              }} />
              <span>{era}</span>
            </div>
          ))}
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene6Eras;

