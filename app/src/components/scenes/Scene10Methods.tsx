import React from 'react';
import { SceneProps } from '@/types';

const Scene10Methods: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  if (!isActive) return null;

  return (
    <g>
      <foreignObject x={50} y={50} width={600} height={400} pointerEvents="auto">
        <div style={{
          background: 'rgba(20, 20, 20, 0.85)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 12,
          padding: '24px 28px',
          color: 'var(--color-text, #eee)',
          font: '14px system-ui',
          backdropFilter: 'blur(8px)',
          lineHeight: '1.6'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#fff'
          }}>
            Methods & Caveats
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#4ecdc4'
            }}>
              Data Processing
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Weighted by context:</strong> Each performance is weighted by its position in the show (opener, centerpiece, closer, etc.)
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>UMAP dimensionality reduction:</strong> Similar musical contexts are arranged nearby in 2D space
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Similarity metric:</strong> Based on musical features + positional context, not genre classification
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#ffa500'
            }}>
              Role Classification
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Opener:</strong> First 2-3 songs of Set 1
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Centerpiece:</strong> Middle of Set 2, typically longest jams
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Landing:</strong> Songs after major jams, return to structure
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Closer:</strong> Final songs of each set
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#ff6b6b'
            }}>
              Jam Level Classification
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Level 0:</strong> Standard song performance
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Level 1:</strong> Light improvisation, extended solos
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Level 2:</strong> Deep jamming, structural exploration
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              • <strong>Level 3:</strong> Type II jamming, complete departure from song structure
            </p>
          </div>

          <div style={{ 
            padding: '16px', 
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: 8,
            fontSize: '12px'
          }}>
            <strong>Note:</strong> This visualization represents patterns across thousands of performances. 
            Individual shows may vary significantly from these general trends. The "shape of a night" 
            emerges from the aggregate, not from any single performance.
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default Scene10Methods;

