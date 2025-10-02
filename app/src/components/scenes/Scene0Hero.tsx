import React, { useEffect } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { drawCircle, clearCanvas } from '@/utils/canvas';
import { createUMAPScales } from '@/utils/scales';

const Scene0Hero: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.spac_timeline) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw SPAC performances with fade-in effect
    data.spac_timeline.forEach((perf) => {
      const x = xScale(perf.x_umap);
      const y = yScale(perf.y_umap);
      
      drawCircle(
        ctx,
        { x, y },
        4,
        `rgba(74, 158, 255, ${Math.max(0.2, progress)})`, // Ensure visibility at scene start
        'rgba(255, 255, 255, 0.3)',
        1
      );
    });
  }, [ctx, data, progress, isActive]);

  return null; // Canvas rendering only
};

export default Scene0Hero;

