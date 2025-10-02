import React, { useRef, useEffect, useState } from 'react';
import './VisualizationCanvas.css';

interface VisualizationCanvasProps {
  children?: React.ReactNode;
}

const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (canvasRef.current && dimensions.width > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        
        // Store current transform
        const currentTransform = ctx.getTransform();
        
        // Reset canvas and clear
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;
        
        // Clear any existing content
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset transform and apply DPI scaling
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        
        // Enable image smoothing for better rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
    }
  }, [dimensions]);

  return (
    <div className="visualization-canvas">
      {/* Canvas layer for performance (dots, trails) */}
      <canvas 
        ref={canvasRef}
        className="viz-canvas"
      />
      
      {/* SVG layer for annotations, labels, interactions */}
      <svg 
        ref={svgRef}
        className="viz-svg"
        width={dimensions.width}
        height={dimensions.height}
      >
        {children}
      </svg>
    </div>
  );
};

export default VisualizationCanvas;

// Export canvas ref hook for child components to access canvas
export const useCanvas = () => {
  const canvas = document.querySelector('.viz-canvas') as HTMLCanvasElement;
  return canvas?.getContext('2d');
};

