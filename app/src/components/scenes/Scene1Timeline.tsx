import React, { useEffect } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawLine } from '@/utils/canvas';
import { createTimelineScale } from '@/utils/scales';

const Scene1Timeline: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.spac_timeline) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const maxSlot = Math.max(...data.spac_timeline.map(p => p.slot_in_show));
    const xScale = createTimelineScale(width, maxSlot);

    // Set Y positions for each set
    const setYPositions = {
      'I': height * 0.35,
      'II': height * 0.5,
      'E': height * 0.65,
    };

    // Draw connecting lines between songs
    for (let i = 0; i < data.spac_timeline.length - 1; i++) {
      const curr = data.spac_timeline[i];
      const next = data.spac_timeline[i + 1];
      
      if (curr.set_label === next.set_label) {
        drawLine(
          ctx,
          { x: xScale(curr.slot_in_show), y: setYPositions[curr.set_label] },
          { x: xScale(next.slot_in_show), y: setYPositions[next.set_label] },
          'rgba(255, 255, 255, 0.2)',
          1,
          0.5
        );
      }
    }

    // Draw song dots
    data.spac_timeline.forEach((perf) => {
      const x = xScale(perf.slot_in_show);
      const y = setYPositions[perf.set_label];
      
      // Size by duration
      const radius = 3 + (perf.duration_sec / 600) * 3;
      
      drawCircle(
        ctx,
        { x, y },
        radius,
        'rgba(74, 158, 255, 0.8)',
        'rgba(255, 255, 255, 0.5)',
        1
      );
    });
  }, [ctx, data, progress, isActive]);

  return null;
};

export default Scene1Timeline;

