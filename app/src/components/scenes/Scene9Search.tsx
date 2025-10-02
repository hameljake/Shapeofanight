import React, { useEffect, useMemo, useState } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';
import { clearCanvas, drawCircle, setGlobalAlpha, resetGlobalAlpha } from '@/utils/canvas';
import { createUMAPScales } from '@/utils/scales';

const Scene9Search: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  const galaxy = data.galaxy || [];
  const showToPerformances = data.show_to_performances || {};

  // Build searchable show list from available data
  const availableShows = useMemo(() => {
    const shows = new Set<string>();
    galaxy.forEach((node) => {
      if (node.show_id) shows.add(node.show_id);
    });
    return Array.from(shows).sort();
  }, [galaxy]);

  // Filter shows based on search term
  const filteredShows = useMemo(() => {
    if (!searchTerm) return availableShows.slice(0, 20); // Show first 20 by default
    return availableShows
      .filter(show => 
        show.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.replace(/-/g, ' ').toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 20); // Limit results
  }, [availableShows, searchTerm]);

  // Get performances for selected show
  const selectedPerformances = useMemo(() => {
    if (!selectedShow) return [];
    return galaxy.filter(node => node.show_id === selectedShow);
  }, [galaxy, selectedShow]);

  useEffect(() => {
    if (!ctx) return;

    const { width, height } = ctx.canvas;
    clearCanvas(ctx, width, height);

    const { xScale, yScale } = createUMAPScales(width, height);

    // Draw all performances as faint background
    setGlobalAlpha(ctx, 0.3);
    galaxy.forEach((node) => {
      const x = xScale(node.x_umap);
      const y = yScale(node.y_umap);
      drawCircle(ctx, { x, y }, 1.2, 'rgba(180, 180, 180, 0.4)');
    });
    resetGlobalAlpha(ctx);

    // Highlight selected show performances
    if (selectedPerformances.length > 0) {
      setGlobalAlpha(ctx, 0.9);
      selectedPerformances.forEach((node) => {
        const x = xScale(node.x_umap);
        const y = yScale(node.y_umap);
        drawCircle(ctx, { x, y }, 3, 'rgba(99, 102, 241, 0.8)');
      });
      resetGlobalAlpha(ctx);
    }
  }, [ctx, galaxy, selectedPerformances, progress]);

  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={16} y={16} width={400} height={200} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '12px 14px',
          color: 'var(--color-text, #eee)',
          font: '12px system-ui',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
              Choose your night
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', opacity: 0.8 }}>
              Search for a show to see its shape in the galaxy
            </p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Search shows (e.g., '2014-07-04', 'SPAC', 'Madison Square')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ 
            maxHeight: '80px', 
            overflowY: 'auto', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            background: 'rgba(0,0,0,0.2)'
          }}>
            {filteredShows.length > 0 ? (
              filteredShows.map((show) => (
                <div
                  key={show}
                  onClick={() => setSelectedShow(show)}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    background: selectedShow === show ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    ':hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedShow === show ? 'rgba(99, 102, 241, 0.3)' : 'transparent';
                  }}
                >
                  {show.replace(/-/g, ' ').replace(/_/g, ' ')}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', opacity: 0.6, fontSize: '11px' }}>
                {searchTerm ? 'No shows found' : 'Type to search shows...'}
              </div>
            )}
          </div>

          {selectedShow && (
            <div style={{ 
              marginTop: 12, 
              padding: '8px 12px', 
              background: 'rgba(99, 102, 241, 0.2)',
              borderRadius: 4,
              fontSize: '11px'
            }}>
              <strong>Selected:</strong> {selectedShow.replace(/-/g, ' ').replace(/_/g, ' ')}
              <br />
              <span style={{ opacity: 0.8 }}>
                {selectedPerformances.length} performances highlighted
              </span>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene9Search;

