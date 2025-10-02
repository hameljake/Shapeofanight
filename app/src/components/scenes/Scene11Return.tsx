import React, { useEffect, useMemo } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawGlow, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales, roleColorScale, jamGlowScale } from '@/utils/scales';

const Scene11Return: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  // const spacTimeline = data.spac_timeline || [];
  const galaxy = data.galaxy || [];
  const jamLevels = data.jam_levels_by_perf || {};

  // Find SPAC performances in galaxy data
  const spacPerformances = useMemo(() => {
    return galaxy.filter(node => node.show_id === '2014-07-04_saratoga-performing-arts-center');
  }, [galaxy]);

  // Create lookup for SPAC timeline data
  // const _spacLookup = useMemo(() => {
  //   const lookup: Record<string, any> = {};
  //   spacTimeline.forEach(perf => {
  //     // Create a key that might match galaxy perf_id
  //     const key = `${perf.song_title.toLowerCase().replace(/\s+/g, '-')}_${perf.set_label}_${perf.position}`;
  //     lookup[key] = perf;
  //   });
  //   return lookup;
  // }, [spacTimeline]);

  useEffect(() => {
    if (!ctx) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw all performances as faint background
    setGlobalAlpha(ctx, 0.2);
    galaxy.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      drawCircle(ctx, { x, y }, 1, 'rgba(180, 180, 180, 0.3)');
    });
    resetGlobalAlpha(ctx);

    // Draw SPAC performances with learned effects
    const t = Math.min(1, Math.max(0, progress));
    
    spacPerformances.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      
      // Get jam level for this performance
      const jamLevel = jamLevels[node.perf_id] || 0;
      const jamIntensity = jamGlowScale(jamLevel) * t;
      
      // Draw jam glow if present
      if (jamLevel > 0 && jamIntensity > 0) {
        const glowColor = jamLevel >= 3 ? '#ef4444' : jamLevel === 2 ? '#f97316' : '#fde047';
        const glowRadius = (20 + jamLevel * 15) * t;
        drawGlow(ctx, { x, y }, glowRadius, glowColor, jamIntensity * 0.6);
      }
      
      // Draw role-colored circle
      const role = 'centerpiece'; // Default, could be enhanced with role lookup
      const roleColor = roleColorScale(role);
      const circleRadius = 3 + jamLevel * 1.5;
      
      setGlobalAlpha(ctx, 0.9 * t);
      drawCircle(ctx, { x, y }, circleRadius, roleColor);
      resetGlobalAlpha(ctx);
      
      // Draw white core
      setGlobalAlpha(ctx, 0.8 * t);
      drawCircle(ctx, { x, y }, 1.5, 'rgba(255, 255, 255, 0.9)');
      resetGlobalAlpha(ctx);
    });

  }, [ctx, galaxy, spacPerformances, jamLevels, progress]);

  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={16} y={16} width={400} height={100} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '12px 14px',
          color: 'var(--color-text, #eee)',
          font: '12px system-ui',
          backdropFilter: 'blur(6px)'
        }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#4ecdc4'
          }}>
            Return to SPAC
          </h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', opacity: 0.8 }}>
            July 4, 2014 — The night that started it all
          </p>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            Now you can see the role colors, jam glows, and energy patterns that define this night's shape.
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene11Return;

