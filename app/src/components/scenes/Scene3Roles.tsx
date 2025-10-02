import React, { useEffect } from 'react';
import { SceneProps, Role } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawGlow, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales, roleColorScale } from '@/utils/scales';

// Role label positions (manually tuned)
const ROLE_LABELS: Record<Role, { dx: number; dy: number }> = {
  opener: { dx: -120, dy: 0 },
  centerpiece: { dx: 20, dy: 0 },
  landing: { dx: 20, dy: -20 },
  closer: { dx: -80, dy: 20 },
  encore: { dx: 0, dy: 30 },
  other: { dx: -60, dy: -20 },
};

const Scene3Roles: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.role_centroids || !data.galaxy || !data.perf_to_role) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw role halos first (underneath)
    data.role_centroids.forEach((centroid) => {
      const x = xScale(centroid.cx);
      const y = yScale(centroid.cy);
      const radius = centroid.r75 * Math.min(width, height) * 0.4; // Scale radius to screen size
      
      // Draw glow with intensity based on progress
      drawGlow(
        ctx,
        { x, y },
        radius,
        roleColorScale(centroid.role),
        0.15 * progress
      );

      // Draw centroid marker
      drawCircle(
        ctx,
        { x, y },
        6,
        roleColorScale(centroid.role),
        'rgba(255, 255, 255, 0.5)',
        1
      );

      // Add role label
      const label = centroid.role.charAt(0).toUpperCase() + centroid.role.slice(1);
      const { dx, dy } = ROLE_LABELS[centroid.role];
      
      ctx.save();
      ctx.font = '14px system-ui';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + dx, y + dy);
      ctx.restore();
    });

    // Draw all performances with role colors
    setGlobalAlpha(ctx, 0.6 * progress);
    data.galaxy.forEach((perf) => {
      const x = xScale(perf.x_umap);
      const y = yScale(perf.y_umap);
      const role = data.perf_to_role?.[perf.perf_id] || 'other';
      
      drawCircle(
        ctx,
        { x, y },
        2,
        roleColorScale(role)
      );
    });
    resetGlobalAlpha(ctx);

  }, [ctx, data, progress, isActive]);

  return null; // Canvas rendering only
};

export default Scene3Roles;