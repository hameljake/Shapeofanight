# Getting Started — The Shape of a Night

This guide will help you get the visualization running locally.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

Check your versions:
```bash
node --version
npm --version
```

## Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

This will install:
- React 18.3 (UI framework)
- Vite 5.3 (build tool)
- D3 7.9 (visualization library)
- TypeScript 5.5 (type safety)
- Framer Motion (animations)
- React Intersection Observer (scroll detection)

## Development

Start the development server:
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`. Changes to source files will hot-reload instantly.

## Project Commands

```bash
# Start dev server with hot reload
npm run dev

# Type-check TypeScript
tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Architecture

### Directory Structure
```
app/
├── scenes/               ← JSON data files (13 files)
├── src/
│   ├── components/       ← React components
│   │   ├── scenes/       ← 12 scene visualizations
│   │   ├── ScrollController.tsx
│   │   ├── SceneManager.tsx
│   │   └── VisualizationCanvas.tsx
│   ├── utils/            ← Helper functions
│   │   ├── dataLoader.ts  (JSON loading & caching)
│   │   ├── scales.ts      (D3 scales)
│   │   ├── layout.ts      (positioning)
│   │   └── canvas.ts      (rendering)
│   ├── types/            ← TypeScript definitions
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### How It Works

1. **User scrolls** → `ScrollController` detects scroll position
2. **Scene calculated** → Maps scroll % to scene number (0-11) + progress (0-1)
3. **Data loaded** → `SceneManager` lazy-loads required JSONs
4. **Scene renders** → Active scene component draws to canvas/SVG
5. **Smooth transitions** → Progress value (0-1) drives all animations

### Rendering Layers

The app uses a **hybrid rendering approach**:

- **Canvas** (bottom layer): Draws ~100k performance dots, trails, glows
  - High performance for large datasets
  - Controlled via `useCanvas()` hook
  
- **SVG** (top layer): Interactive UI elements, labels, annotations
  - Hover tooltips
  - Click handlers
  - Text labels

## Implementation Roadmap

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Project scaffolding
- [x] Scroll system
- [x] Canvas + SVG infrastructure
- [x] Data loader with caching
- [x] TypeScript types
- [x] Utility functions
- [x] Scenes 0-2 (basic demos)

### 🚧 Phase 2: Scene Implementation (NEXT)
- [ ] Scene 3: Role halos + color coding
- [ ] Scene 4: Energy curve line chart
- [ ] Scene 5: Jam glow effects + filter slider
- [ ] Scene 6: Era trails animation
- [ ] Scene 7: Venue force simulation
- [ ] Scene 8: Special runs grid
- [ ] Scene 9: Search interface
- [ ] Scene 10: Methods box
- [ ] Scene 11: SPAC return with effects

### 🔮 Phase 3: Polish & Optimization
- [ ] Smooth UMAP ↔ Timeline transitions
- [ ] Interactive tooltips on hover
- [ ] Mobile responsive design
- [ ] Performance optimization (WebGL?)
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Loading states & skeleton screens

## Key Files to Know

### Core Components

**`ScrollController.tsx`**
- Detects scroll position
- Maps to scene index + progress
- Renders scrollable text sections

**`SceneManager.tsx`**
- Loads data for current + adjacent scenes
- Switches between scene components
- Handles transitions

**`VisualizationCanvas.tsx`**
- Provides canvas + SVG rendering layers
- Handles window resizing
- Exports `useCanvas()` hook

### Scene Components

All scenes follow this pattern:

```tsx
const SceneXName: React.FC<SceneProps> = ({ data, isActive, progress }) => {
  const ctx = useCanvas(); // Access canvas context

  useEffect(() => {
    if (!ctx || !data.yourData) return;
    
    // Clear canvas
    clearCanvas(ctx, width, height);
    
    // Draw based on data + progress
    // progress goes from 0 → 1 as user scrolls through scene
  }, [ctx, data, progress, isActive]);

  return null; // or <g>...</g> for SVG overlays
};
```

### Utility Files

**`dataLoader.ts`**
- Maps scene numbers to required JSON files
- Implements caching to avoid reloading
- Lazy loads only when needed

**`scales.ts`**
- D3 scale functions for UMAP coordinates
- Color scales for roles, eras, energy
- Timeline positioning scales

**`layout.ts`**
- Layout helpers (UMAP, timeline, grid)
- Interpolation functions for smooth transitions
- Easing functions

**`canvas.ts`**
- Low-level canvas drawing primitives
- `drawCircle()`, `drawLine()`, `drawGlow()`
- Batch rendering for performance

## Data Files Reference

Located in `app/scenes/`:

| File | Size | Used In | Description |
|------|------|---------|-------------|
| `spac_2014_07_04_timeline.json` | ~2KB | 0, 1, 11 | SPAC July 4 2014 setlist |
| `galaxy_min.json` | ~8MB | 2, 3, 5, 6, 7, 9, 11 | All performances (100k nodes) |
| `show_to_performances.json` | ~1MB | 2, 9 | Show → perf_ids lookup |
| `role_centroids.json` | ~1KB | 3 | UMAP centroids per role |
| `perf_to_role.json` | ~2MB | 3 | Perf_id → role mapping |
| `energy_curve_global.json` | ~2KB | 4 | Global energy curve (40 bins) |
| `spac_energy_curve.json` | ~1KB | 4 | SPAC overlay curve |
| `jam_levels_by_perf.json` | ~2MB | 5 | Perf_id → jam level (0-3) |
| `song_trails.json` | ~20KB | 6 | Era drift trails per song |
| `venue_affinity_selected.json` | ~10KB | 7 | Top songs per venue |
| `specials_grid.json` | ~5KB | 8 | Special runs summary |

## Customization

### Adjusting UMAP Coordinate Range

If your UMAP data has a different range than -10 to 10, update `src/utils/scales.ts`:

```tsx
export const createUMAPScales = (...) => {
  const xScale = scaleLinear()
    .domain([-15, 15]) // ← Adjust these
    .range([margin.left, width - margin.right]);
  // ...
};
```

### Changing Colors

Edit CSS custom properties in `src/index.css`:

```css
:root {
  --color-opener: #06b6d4;      /* Cyan */
  --color-centerpiece: #f59e0b; /* Amber */
  --color-era-1: #8b5cf6;       /* Purple */
  /* ... */
}
```

### Adding New Scenes

1. Create `src/components/scenes/SceneXNew.tsx`
2. Add to `SceneManager.tsx` imports
3. Add conditional render in `SceneManager`
4. Update `SCENE_COUNT` in `ScrollController`
5. Add data mapping in `dataLoader.ts`

## Troubleshooting

**Q: Canvas is blank**
- Check that JSON files are in `app/scenes/` directory
- Open browser console for errors
- Verify UMAP scale domain matches your data

**Q: Scroll doesn't trigger scenes**
- Ensure `ScrollController` ref is attached
- Check that sections have `min-height: 100vh`
- Verify `SCENE_COUNT` matches number of scenes

**Q: TypeScript errors**
- Run `npm install` to ensure types are installed
- Check `tsconfig.json` path aliases
- Verify imports use `@/` prefix

**Q: Performance is slow**
- Reduce galaxy rendering (sample dots)
- Consider WebGL for 100k+ points
- Enable React DevTools Profiler

## Next Steps

1. **Run the app**: `npm run dev`
2. **Explore Scenes 0-2**: See basic SPAC → Timeline → Galaxy
3. **Implement Scene 3**: Add role halos (good first task!)
4. **Read the data**: Inspect JSON files in `scenes/` directory
5. **Customize styles**: Edit CSS variables for your aesthetic

## Resources

- [D3 Documentation](https://d3js.org/)
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Scrollytelling Examples](https://pudding.cool/)

---

**Questions?** Check the main project README or open an issue.

