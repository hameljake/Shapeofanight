# The Shape of a Night — Frontend

A NYT-style scrollytelling visualization exploring Phish concert data through 12 interconnected scenes.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## Project Structure

```
app/
├── scenes/                    # JSON data files (from parent /app/scenes/)
│   ├── spac_2014_07_04_timeline.json
│   ├── galaxy_min.json
│   ├── role_centroids.json
│   └── ... (13 total scene JSONs)
│
├── src/
│   ├── components/
│   │   ├── ScrollController.tsx    # Scroll detection & scene mapping
│   │   ├── SceneManager.tsx        # Scene state & data loading
│   │   ├── VisualizationCanvas.tsx # Canvas + SVG rendering layers
│   │   └── scenes/                 # Individual scene components
│   │       ├── Scene0Hero.tsx
│   │       ├── Scene1Timeline.tsx
│   │       ├── Scene2Galaxy.tsx
│   │       └── ... (12 total scenes)
│   │
│   ├── utils/
│   │   ├── dataLoader.ts      # JSON loading & caching
│   │   ├── scales.ts          # D3 scales (UMAP, timeline, colors)
│   │   ├── layout.ts          # Layout helpers & transitions
│   │   └── canvas.ts          # Canvas rendering utilities
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Architecture

### Scroll System
- **ScrollController**: Maps scroll position to scene index (0-11) and progress (0-1)
- **SceneManager**: Loads data for current + adjacent scenes, renders active scene component
- **VisualizationCanvas**: Fixed-position canvas + SVG layers for rendering

### Rendering Layers
1. **Canvas** (bottom): High-performance rendering for ~100k dots, trails, glows
2. **SVG** (top): Interactive elements, annotations, labels, UI controls

### Data Flow
1. User scrolls → ScrollController detects position
2. Scene number calculated → SceneManager loads required JSONs
3. Data passed to scene component → Component renders to canvas/SVG
4. Smooth transitions as progress (0-1) updates

## Scene Overview

| Scene | Name | Data Files | Visualization |
|-------|------|------------|---------------|
| 0 | Hero | `spac_2014_07_04_timeline.json` | SPAC dots fade in on UMAP |
| 1 | Timeline | `spac_2014_07_04_timeline.json` | Horizontal timeline by slot |
| 2 | Galaxy | `galaxy_min.json` | Full UMAP scatter (~100k dots) |
| 3 | Roles | `role_centroids.json`, `perf_to_role.json` | Color halos by role |
| 4 | Energy | `energy_curve_global.json`, `spac_energy_curve.json` | Line chart with bands |
| 5 | Jams | `jam_levels_by_perf.json` | Glow by jam length |
| 6 | Eras | `song_trails.json` | Trail lines showing drift |
| 7 | Venues | `venue_affinity_selected.json` | Force-directed pull |
| 8 | Specials | `specials_grid.json` | Small multiples grid |
| 9 | Search | `shows_index.json` | Search interface |
| 10 | Methods | (none) | Static methodology box |
| 11 | Return | `spac_2014_07_04_timeline.json`, `galaxy_min.json` | SPAC with learned effects |

## Implementation Status

### ✅ Complete
- Project scaffolding
- Scroll detection system
- Scene management & data loading
- Canvas/SVG rendering infrastructure
- Type definitions
- Utility functions (scales, layout, canvas)
- Scene 0-2 (basic implementations)

### 🚧 To Implement
- **Scene 3**: Role halo circles + color coding
- **Scene 4**: D3 line chart with confidence bands
- **Scene 5**: Jam glow effects + slider filter
- **Scene 6**: Era color coding + trail animations
- **Scene 7**: Venue selector + force simulation
- **Scene 8**: Small multiples grid layouts
- **Scene 9**: Search autocomplete + show rendering
- **Scene 10**: Methods box with micro-charts
- **Scene 11**: Combined effects on SPAC data
- Smooth layout transitions (UMAP ↔ Timeline)
- Interactive tooltips & hover states
- Mobile responsiveness
- Performance optimization (virtualization, WebGL)
- Accessibility (ARIA labels, keyboard nav)

## Key Technical Decisions

1. **Vite + React + TypeScript**: Fast builds, type safety, modern tooling
2. **Canvas for dots, SVG for UI**: Balance performance and interactivity
3. **Lazy JSON loading**: Only load data for visible scenes
4. **Scroll-driven animations**: Progress (0-1) drives all transitions
5. **CSS custom properties**: Easy theming for colors

## Data Assumptions

- UMAP coordinates range: `-10 to 10` (adjust in `scales.ts` if needed)
- Galaxy contains ~100k nodes (tested up to this scale)
- SPAC show ID: `2014-07-04_saratoga-performing-arts-center`
- Role types: `opener`, `centerpiece`, `landing`, `closer`, `encore`, `other`
- Jam levels: `0` (<10m), `1` (≥10m), `2` (≥15m), `3` (≥20m)

## Next Steps

1. **Implement remaining scenes (3-11)**
2. **Add layout transitions** (smooth morphing between UMAP/Timeline)
3. **Optimize galaxy rendering** (consider WebGL for 100k+ dots)
4. **Add interactions** (hover tooltips, click handlers, filters)
5. **Polish typography & styling** (NYT aesthetic)
6. **Mobile optimization** (touch gestures, responsive layouts)
7. **Performance tuning** (memoization, virtualization, code splitting)

## Contributing

Each scene component follows this pattern:

```tsx
import React, { useEffect } from 'react';
import { SceneProps } from '@/types';
import { useCanvas } from '../VisualizationCanvas';

const SceneXName: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas();

  useEffect(() => {
    if (!ctx || !data.yourData) return;
    
    // Canvas rendering logic here
    // Use progress (0-1) for animations
  }, [ctx, data, progress, isActive]);

  return (
    <>
      {/* Optional SVG overlay elements */}
    </>
  );
};

export default SceneXName;
```

## License

Part of "The Shape of a Night" project. See parent README for details.

