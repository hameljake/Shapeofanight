import React, { useEffect } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { scaleLinear } from 'd3-scale';

const Scene4Energy: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.energy_curve_global) return;

    // Compute CSS pixel dimensions for layout (context is scaled for DPR)
    const dpr = window.devicePixelRatio || 1;
    const width = ctx.canvas.clientWidth || ctx.canvas.width / dpr;
    const height = ctx.canvas.clientHeight || ctx.canvas.height / dpr;

    // Ensure proper canvas clearing using device pixels
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    // Set up margins with more space for visualization
    const margin = {
      top: Math.max(120, height * 0.15),
      right: Math.max(180, width * 0.15),
      bottom: Math.max(100, height * 0.12),
      left: Math.max(100, width * 0.1)
    };

    // Set up scales with optimized ranges
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);

    // Compute dynamic Y-domain to include both global curve and SPAC curve
    let minGlobal = Infinity;
    let maxGlobal = -Infinity;
    data.energy_curve_global.forEach((p: any) => {
      const low = typeof p.q25 === 'number' ? p.q25 : p.median;
      const high = typeof p.q75 === 'number' ? p.q75 : p.median;
      minGlobal = Math.min(minGlobal, low, p.median);
      maxGlobal = Math.max(maxGlobal, high, p.median);
    });

    let minSpac = Infinity;
    let maxSpac = -Infinity;
    if (data.spac_energy_curve && data.spac_energy_curve.length > 0) {
      data.spac_energy_curve.forEach((p: any) => {
        if (typeof p.energy === 'number') {
          minSpac = Math.min(minSpac, p.energy);
          maxSpac = Math.max(maxSpac, p.energy);
        }
      });
    } else {
      minSpac = 0;
      maxSpac = 0;
    }

    let domainMin = Math.min(minGlobal, minSpac);
    let domainMax = Math.max(maxGlobal, maxSpac);
    if (!isFinite(domainMin) || !isFinite(domainMax)) {
      domainMin = -1;
      domainMax = 1;
    }
    const padding = 0.05 * (domainMax - domainMin || 1);

    const yScale = scaleLinear()
      .domain([domainMin - padding, domainMax + padding])
      .range([height - margin.bottom, margin.top]);

    // Helper function to draw a line from data points
    const drawLineFromPoints = (points: any[], color: string, width: number, alpha: number = 1) => {
      if (points.length === 0) return;

      setGlobalAlpha(ctx, alpha);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();

      // Move to first point
      ctx.moveTo(xScale(points[0].slot_bin), yScale(points[0].median));

      // Draw line to subsequent points
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(xScale(points[i].slot_bin), yScale(points[i].median));
      }

      ctx.stroke();
      resetGlobalAlpha(ctx);
    };

    // Helper function to draw confidence band area
    const drawConfidenceBand = (points: any[], alpha: number = 1) => {
      if (points.length === 0) return;

      setGlobalAlpha(ctx, alpha);
      ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
      ctx.beginPath();

      // Start from bottom (q75) going right
      ctx.moveTo(xScale(points[0].slot_bin), yScale(points[0].q75));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(xScale(points[i].slot_bin), yScale(points[i].q75));
      }

      // Then back from top (q25) going left
      for (let i = points.length - 1; i >= 0; i--) {
        ctx.lineTo(xScale(points[i].slot_bin), yScale(points[i].q25));
      }

      ctx.closePath();
      ctx.fill();
      resetGlobalAlpha(ctx);
    };

    // Draw confidence bands first (background)
    drawConfidenceBand(data.energy_curve_global, 0.3 * progress);

    // Draw median line
    drawLineFromPoints(data.energy_curve_global, '#4a9eff', 3, progress);

    // Draw SPAC curve if available (overlay)
    if (data.spac_energy_curve) {
      setGlobalAlpha(ctx, 0.8 * progress);
      ctx.strokeStyle = '#ff4a4a';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(xScale(data.spac_energy_curve[0].slot_bin), yScale(data.spac_energy_curve[0].energy));
      for (let i = 1; i < data.spac_energy_curve.length; i++) {
        ctx.lineTo(xScale(data.spac_energy_curve[i].slot_bin), yScale(data.spac_energy_curve[i].energy));
      }
      ctx.stroke();

      ctx.setLineDash([]);
      resetGlobalAlpha(ctx);
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    // Add labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';

    // Y-axis labels
    ctx.save();
    ctx.translate(margin.left - 40, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energy Level', 0, 0);
    ctx.restore();

    // Y-axis markers
    ctx.textAlign = 'right';
    ctx.fillText('High', margin.left - 10, margin.top + 20);
    ctx.fillText('Low', margin.left - 10, height - margin.bottom - 10);

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.fillText('Show Progress', width / 2, height - margin.bottom + 40);

    // Legend
    if (data.spac_energy_curve) {
      const legendX = width - margin.right + 20;
      const legendY = margin.top;

      ctx.fillStyle = '#4a9eff';
      ctx.fillRect(legendX, legendY, 16, 8);
      ctx.fillStyle = '#ff4a4a';
      ctx.fillRect(legendX, legendY + 25, 16, 8);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('All Shows (Median)', legendX + 25, legendY + 8);
      ctx.fillText('SPAC 2014', legendX + 25, legendY + 33);
    }

  }, [ctx, data, progress, isActive]);

  return null; // Canvas rendering only
};

export default Scene4Energy;

