import React, { useEffect } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle } from '@/utils/canvas';
import { createUMAPScales } from '@/utils/scales';

const Scene2Galaxy: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.galaxy) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw all performances as gray dots
    data.galaxy.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      
      // Highlight SPAC show if available
      const isSPAC = node.show_id === '2014-07-04_saratoga-performing-arts-center';
      
      drawCircle(
        ctx,
        { x, y },
        isSPAC ? 3 : 1.5,
        isSPAC ? 'rgba(74, 158, 255, 0.95)' : 'rgba(180, 180, 180, 0.55)',
      );
    });
  }, [ctx, data, progress, isActive]);

  return null;
};

export default Scene2Galaxy;

