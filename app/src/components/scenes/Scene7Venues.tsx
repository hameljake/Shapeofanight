import React, { useEffect, useMemo, useState } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, drawLine, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales } from '@/utils/scales';

type VenueKey = string;

const DEFAULT_VENUES: VenueKey[] = [
  'saratoga-performing-arts-center',
  'madison-square-garden',
  'ruoff-music-center',
];

const Scene7Venues: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();
  const [selectedVenue, setSelectedVenue] = useState<VenueKey>('saratoga-performing-arts-center');

  const affinityMap = (data.venue_affinity_selected || {}) as Record<VenueKey, Array<{ song_slug: string; affinity: number }>>;
  const galaxy = data.galaxy || [];

  // Build quick lookup for song positions (UMAP centers by song via median of points)
  const songToPoint = useMemo(() => {
    // Fallback: approximate per song by averaging all occurrences in galaxy
    const acc: Record<string, { x: number; y: number; n: number }> = {};
    galaxy.forEach((node) => {
      const key = node.perf_id.split('_')[0] || node.perf_id; // best-effort; galaxy only has perf_id and not song_slug
      if (!acc[key]) acc[key] = { x: 0, y: 0, n: 0 };
      acc[key].x += node.x_umap;
      acc[key].y += node.y_umap;
      acc[key].n += 1;
    });
    const out: Record<string, { x: number; y: number }> = {};
    Object.entries(acc).forEach(([k, v]) => {
      out[k] = { x: v.x / v.n, y: v.y / v.n };
    });
    return out;
  }, [galaxy]);

  // Prepare nodes for the selected venue: map each song to a weighted bubble
  const venueNodes = useMemo(() => {
    const entries = affinityMap[selectedVenue] || [];
    // normalize weights
    const maxAffinity = entries.reduce((m, d) => Math.max(m, d.affinity), 0) || 1;
    return entries.map((d) => {
      const approxSongKey = d.song_slug; // use slug as key
      const base = songToPoint[approxSongKey] || { x: Math.random(), y: Math.random() };
      return {
        song_slug: d.song_slug,
        x: base.x,
        y: base.y,
        weight: d.affinity / maxAffinity,
      };
    });
  }, [affinityMap, selectedVenue, songToPoint]);

  useEffect(() => {
    if (!ctx) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw faint galaxy backdrop
    setGlobalAlpha(ctx, 0.25);
    galaxy.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      drawCircle(ctx, { x, y }, 1.1, 'rgba(180,180,180,0.6)');
    });
    resetGlobalAlpha(ctx);

    // Force-like attraction to venue centroid: compute centroid from weighted nodes
    const centroid = venueNodes.reduce(
      (acc, n) => {
        acc.x += n.x * n.weight;
        acc.y += n.y * n.weight;
        acc.w += n.weight;
        return acc;
      },
      { x: 0, y: 0, w: 0 }
    );
    const cx = centroid.w ? centroid.x / centroid.w : 0.5;
    const cy = centroid.w ? centroid.y / centroid.w : 0.5;

    // Animate pull by progress
    const strength = 0.4 * Math.min(1, Math.max(0, progress));

    // Render venue nodes: draw lines to centroid and bubbles sized by weight
    venueNodes.forEach((n) => {
      const ix = n.x;
      const iy = n.y;
      const tx = ix + (cx - ix) * strength;
      const ty = iy + (cy - iy) * strength;

      const px = xScale(ix);
      const py = yScale(iy);
      const qx = xScale(tx);
      const qy = yScale(ty);

      drawLine(ctx, { x: px, y: py }, { x: qx, y: qy }, 'rgba(255, 255, 255, 0.25)', 1, 0.6);

      const radius = 2 + n.weight * Math.min(width, height) * 0.02;
      drawCircle(ctx, { x: qx, y: qy }, radius, 'rgba(99, 102, 241, 0.9)');
    });
  }, [ctx, galaxy, venueNodes, progress]);

  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={16} y={16} width={320} height={80} pointerEvents="auto">
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
            <span style={{ opacity: 0.85 }}>Venue:</span>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.35)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                padding: '4px 8px'
              }}
            >
              {Object.keys(affinityMap).length
                ? Object.keys(affinityMap).map((v) => (
                    <option key={v} value={v}>{v.replace(/-/g, ' ')}</option>
                  ))
                : DEFAULT_VENUES.map((v) => (
                    <option key={v} value={v}>{v.replace(/-/g, ' ')}</option>
                  ))}
            </select>
          </div>
          <div style={{ opacity: 0.8 }}>Bubbles pull toward the venue’s affinity center. Size = affinity.</div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene7Venues;

