import React, { useEffect, useMemo, useState } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawLine, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { layoutGrid } from '@/utils/layout';

type SpecialType = 'all' | 'nye' | 'halloween' | 'bakers_dozen' | 'dicks' | 'festival';

const Scene8Specials: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();
  const [filterType, setFilterType] = useState<SpecialType>('all');

  const specials = (data.specials_grid || []) as unknown as Array<{
    show_id: string;
    date: string;
    venue_slug: string;
    is_nye: number;
    is_halloween: number;
    is_bakers_dozen: number;
    is_dicks: number;
    is_festival: number;
    perf_count: number;
    median_energy: number;
    longest_jam_sec: number;
    longest_jam_song: string;
  }>;

  const filteredSpecials = useMemo(() => {
    if (filterType === 'all') return specials;
    return specials.filter((s) => {
      switch (filterType) {
        case 'nye': return s.is_nye === 1;
        case 'halloween': return s.is_halloween === 1;
        case 'bakers_dozen': return s.is_bakers_dozen === 1;
        case 'dicks': return s.is_dicks === 1;
        case 'festival': return s.is_festival === 1;
        default: return true;
      }
    });
  }, [specials, filterType]);

  // Grid layout: arrange shows in a grid
  const gridCols = 8;
  const cellWidth = 80;
  const cellHeight = 60;
  const margin = { top: 60, left: 40 };

  useEffect(() => {
    if (!ctx) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    // Draw grid cells for each special show
    setGlobalAlpha(ctx, 0.85);

    filteredSpecials.forEach((show, index) => {
      const pos = layoutGrid(index, gridCols, cellWidth, cellHeight, margin);
      const x = pos.x;
      const y = pos.y;

      // Skip if off-screen
      if (x > width || y > height) return;

      // Color by special type
      let color = '#666666';
      if (show.is_nye) color = '#ff6b6b';
      else if (show.is_halloween) color = '#ffa500';
      else if (show.is_bakers_dozen) color = '#4ecdc4';
      else if (show.is_dicks) color = '#45b7d1';
      else if (show.is_festival) color = '#96ceb4';

      // Draw cell background
      drawCircle(ctx, { x: x + cellWidth/2, y: y + cellHeight/2 }, Math.min(cellWidth, cellHeight) * 0.3, color);

      // Draw energy curve (simplified as a line)
      const energyHeight = (show.median_energy + 1) * (cellHeight * 0.3); // normalize -1 to 1
      const startY = y + cellHeight/2;
      const endY = startY - energyHeight;
      drawLine(ctx, 
        { x: x + cellWidth/2, y: startY }, 
        { x: x + cellWidth/2, y: endY }, 
        'rgba(255, 255, 255, 0.8)', 
        2
      );

      // Draw performance count as small dots
      const perfDots = Math.min(show.perf_count, 20); // cap for visibility
      for (let i = 0; i < perfDots; i++) {
        const dotX = x + 10 + (i % 5) * 12;
        const dotY = y + 10 + Math.floor(i / 5) * 8;
        drawCircle(ctx, { x: dotX, y: dotY }, 1.5, 'rgba(255, 255, 255, 0.6)');
      }
    });

    resetGlobalAlpha(ctx);
  }, [ctx, filteredSpecials, progress]);

  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={16} y={16} width={320} height={120} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '8px 10px',
          color: 'var(--color-text, #eee)',
          font: '12px system-ui',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ opacity: 0.85 }}>Special shows:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as SpecialType)}
              style={{
                background: 'rgba(0,0,0,0.35)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                padding: '4px 8px'
              }}
            >
              <option value="all">All specials</option>
              <option value="nye">New Year's Eve</option>
              <option value="halloween">Halloween</option>
              <option value="bakers_dozen">Baker's Dozen</option>
              <option value="dicks">Dick's</option>
              <option value="festival">Festivals</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '10px', opacity: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#ff6b6b', borderRadius: '50%' }} />
              <span>NYE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#ffa500', borderRadius: '50%' }} />
              <span>Halloween</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#4ecdc4', borderRadius: '50%' }} />
              <span>Baker's Dozen</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#96ceb4', borderRadius: '50%' }} />
              <span>Festivals</span>
            </div>
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginTop: 4 }}>
            Each cell: energy curve (white line), performance count (dots)
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene8Specials;

