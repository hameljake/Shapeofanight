# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SCROLLS                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ScrollController.tsx                          │
│  • Detects scroll position                                      │
│  • Calculates: currentScene (0-11) + progress (0-1)             │
│  • Renders text content sections                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SceneManager.tsx                            │
│  • Receives: currentScene, progress                             │
│  • Lazy loads required JSONs (with caching)                     │
│  • Switches between scene components                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Active Scene Component                          │
│  Example: Scene3Roles.tsx                                       │
│  • Receives: { data, isActive, progress }                       │
│  • Draws to canvas/SVG based on progress                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 VisualizationCanvas.tsx                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  CANVAS LAYER (bottom)                                    │  │
│  │  • Renders ~100k dots, trails, glows                      │  │
│  │  • High performance for large datasets                    │  │
│  │  • Accessed via useCanvas() hook                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SVG LAYER (top)                                          │  │
│  │  • Interactive UI: labels, tooltips, controls             │  │
│  │  • Annotations, legends, text                             │  │
│  │  • Pointer events enabled                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
JSON Files                 Data Loader              Scene Component
┌─────────────┐           ┌──────────┐             ┌──────────────┐
│ galaxy_min  │           │          │             │              │
│ .json       │──────────▶│  Cache   │────────────▶│  useEffect   │
└─────────────┘           │          │             │  (renders)   │
┌─────────────┐           │  Map to  │             │              │
│ role_       │           │  scene   │             │  Canvas API  │
│ centroids   │──────────▶│  data    │────────────▶│  or          │
│ .json       │           │  struct  │             │  SVG JSX     │
└─────────────┘           │          │             │              │
┌─────────────┐           │  Lazy    │             └──────────────┘
│ ...other    │           │  load    │
│ JSONs       │──────────▶│  on      │
└─────────────┘           │  demand  │
                          └──────────┘
```

---

## Scene Progression

```
Scroll:   0% ─────────────────────────────────────────────────── 100%
          │                                                        │
Scenes:   0    1    2    3    4    5    6    7    8    9   10   11
          │    │    │    │    │    │    │    │    │    │    │    │
          Hero │    │    │    │    │    │    │    │    │    │    │
               Time │    │    │    │    │    │    │    │    │    │
                    Gal  │    │    │    │    │    │    │    │    │
                         Role│    │    │    │    │    │    │    │
                             Ener   │    │    │    │    │    │    │
                                  Jam   │    │    │    │    │    │
                                       Era   │    │    │    │    │
                                            Venue  │    │    │    │
                                                  Spec   │    │    │
                                                       Search │    │
                                                             Meth  │
                                                                  Ret

Progress: 0.0 ──▶ 1.0  (within each scene for smooth animations)
```

---

## Component Hierarchy

```
App.tsx
└── ScrollController.tsx
    ├── scroll-content (scrollable sections)
    │   └── 12 × ScrollSection
    │       └── Scene text (title + copy)
    │
    └── visualization-fixed (fixed position)
        └── SceneManager.tsx
            ├── Data loading logic
            └── VisualizationCanvas.tsx
                ├── <canvas> (dots, trails)
                └── <svg> (labels, UI)
                    └── Active Scene Component
                        ├── Scene0Hero
                        ├── Scene1Timeline
                        ├── Scene2Galaxy
                        ├── Scene3Roles
                        ├── ...
                        └── Scene11Return
```

---

## Utility Dependencies

```
Scene Components
      │
      ├──▶ utils/scales.ts
      │    • createUMAPScales()
      │    • roleColorScale
      │    • eraColorScale
      │
      ├──▶ utils/layout.ts
      │    • layoutUMAP()
      │    • layoutTimeline()
      │    • interpolatePoint()
      │
      ├──▶ utils/canvas.ts
      │    • drawCircle()
      │    • drawLine()
      │    • drawGlow()
      │
      └──▶ utils/dataLoader.ts
           • loadSceneData()
           • Caching logic
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│  ScrollController                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ useState(currentScene)  ←── scroll position          │  │
│  │ useState(sceneProgress) ←── within-scene progress    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ props
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  SceneManager                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ useState(sceneData)     ←── loaded JSONs (cached)    │  │
│  │ useState(loading)       ←── async load state         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ props
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Scene Component                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ useEffect()             ←── re-renders on:           │  │
│  │                             • data change            │  │
│  │                             • progress change        │  │
│  │                             • isActive change        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Rendering Pipeline

```
1. User scrolls
   ↓
2. ScrollController calculates scene number + progress
   ↓
3. SceneManager checks if data is loaded
   ├─ Yes → Pass to scene component
   └─ No  → Load JSON → Cache → Pass to component
   ↓
4. Scene component's useEffect fires
   ↓
5. Component accesses canvas context via useCanvas()
   ↓
6. Component draws visualization:
   • clearCanvas()
   • Create scales (UMAP, timeline, color)
   • Loop through data
   • drawCircle() / drawLine() / etc.
   • Use progress (0-1) for animations
   ↓
7. User sees updated visualization
   ↓
8. Repeat on scroll
```

---

## File Organization Pattern

```
Scene Implementation Files:
────────────────────────────

/src/components/scenes/Scene3Roles.tsx
    • Component logic
    • useEffect for rendering
    • Canvas drawing code

/src/utils/scales.ts
    • roleColorScale (D3 scale)
    • Reusable across scenes

/scenes/role_centroids.json
    • Data source
    • Loaded via dataLoader.ts

/src/types/index.ts
    • interface RoleCentroid
    • Type safety
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────┐
│  Current (100k dots)                                     │
│  • Canvas rendering                                      │
│  • requestAnimationFrame                                │
│  • Lazy data loading                                    │
│  • Caching JSONs                                         │
│  Target: 60fps on modern browsers                       │
└─────────────────────────────────────────────────────────┘
                     │
                     │ If needed (500k+ dots)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Future Optimizations                                    │
│  • WebGL rendering (Three.js/PixiJS)                    │
│  • Viewport culling (only render visible)               │
│  • Web Workers for data processing                      │
│  • Spatial indexing (quadtree)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Build & Deployment Pipeline

```
Development                Production
─────────────              ──────────────

npm run dev               npm run build
    │                         │
    ▼                         ▼
Vite dev server          Bundle optimization
• Hot reload             • Minification
• Source maps            • Tree shaking
• Fast refresh           • Code splitting
    │                         │
    ▼                         ▼
localhost:3000           /dist/ folder
                             │
                             ▼
                         Deploy to:
                         • Vercel
                         • Netlify
                         • S3 + CloudFront
                         • GitHub Pages
```

---

## CSS Architecture

```
Global Styles               Component Styles
─────────────               ────────────────

/src/index.css              /src/components/*.css
• CSS variables             • Component-specific
• Color palette             • BEM naming
• Typography                • Scoped styles
• Resets
    │
    ├─ --color-opener: #06b6d4
    ├─ --color-centerpiece: #f59e0b
    ├─ --color-era-1: #8b5cf6
    └─ ... (used in scales.ts)
```

---

## Type System Flow

```
JSON Data                TypeScript Interface         Component
─────────                ───────────────────          ─────────

{                        interface RoleCentroid {     const centroids:
  "role": "opener",        role: Role;                  RoleCentroid[] = 
  "cx": 1.23,              cx: number;                  data.role_centroids
  "cy": -4.56,             cy: number;              
  "r75": 2.1,              r75: number;               ✓ Type-safe!
  "n": 1234                n: number;                 ✓ Autocomplete!
}                        }                            ✓ Compile errors!
```

---

## Development Workflow

```
1. Edit scene component
   /src/components/scenes/Scene3Roles.tsx
   
2. Save file (Vite hot-reloads)
   
3. Browser updates instantly
   
4. Check console for errors
   
5. Scroll to scene (Scene 3 ≈ 25%)
   
6. Verify visualization
   
7. Adjust based on progress (0-1)
   
8. Repeat until polished
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Type safety throughout
✅ Performance-optimized rendering
✅ Smooth scroll-driven animations
✅ Extensible scene system
✅ Production-ready build pipeline

