
# The Shape of a Night — Data Bundle + Frontend

This repository contains:
1. **Data pipeline outputs**: Enriched CSV tables and scene-specific JSONs
2. **Frontend app**: React + D3 scrollytelling visualization (in `app/`)

## Quick Start

### Run the Visualization
```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000` to see the scrollytelling experience.

See **[app/GETTING_STARTED.md](app/GETTING_STARTED.md)** for detailed setup and implementation guide.

---

## Contents

### Derived Tables (CSV)
- `data/derived/performances_enriched.csv` — canonical node table with roles, jam levels, energy, specials.
- `data/derived/energy_curves_allshows.csv` — per-show energy curves interpolated to 40 bins.
- `data/derived/energy_curve_global.csv` — global median + IQR across bins.
- `data/derived/energy_curve_by_era.csv` — median + IQR per era.
- `data/derived/jam_stats_by_song.csv` — jam thresholds by song.
- `data/derived/jam_stats_by_song_era.csv` — jam thresholds by song × era.
- `data/derived/role_centroids.csv` — UMAP centroids for role halos.
- `data/derived/song_era_centroids.csv` — song × era UMAP centroids.
- `data/derived/song_era_trails.csv` — ordered trails per song across eras.
- `data/derived/venue_affinity.csv` — venue affinity index for song × venue pairs.
- `data/derived/special_runs_summary.csv` — per-show summary for NYE/Halloween/Baker's/Dick's/festivals.
- `data/derived/shows_index.csv` — search index for all shows.

### Scene JSONs (`app/scenes/`)
- `spac_2014_07_04_timeline.json`
- `galaxy_min.json`
- `show_to_performances.json`
- `role_centroids.json`
- `perf_to_role.json`
- `energy_curve_global.json`
- `spac_energy_curve.json`
- `jam_levels_by_perf.json`
- `song_trails.json`
- `venue_affinity_full.json`
- `venue_affinity_selected.json`
- `specials_grid.json`
- `shows_index.json`

### Frontend App (`app/`)
- **React + Vite + TypeScript** scrollytelling visualization
- 12 interconnected scenes (Hero → Galaxy → Roles → Energy → ... → Return)
- Canvas + SVG hybrid rendering for performance
- See `app/README.md` for architecture details

### Docs
- `docs/qa_report.txt` — sanity checks and quick stats
- `docs/task_list_progress.md` — the roadmap with progress boxes
- `app/GETTING_STARTED.md` — frontend setup and implementation guide

## Implementation Notes
- Encore ordering: `E` is forced last via `set_order_val=99`.
- Role labeling is rule-based and includes a `role_confidence` field.
- Energy score: within-show z-score of log(duration+1) plus a 0.2× rarity boost (global z).
- Era mapping: 1.0 (≤2000), 2.0 (2003–2004), 3.0 (2009–2020), 4.0 (≥2021), else "Other/Hiatus".
- Venue affinity excludes venues with <20 total performances; per-venue top-N filtered to songs with ≥3 plays at that venue.

## Frontend Implementation Status

### ✅ Complete (Phase 1)
- Project scaffolding with Vite + React + TypeScript
- Scroll detection system mapping position → scenes
- Canvas + SVG rendering infrastructure
- Data loader with caching for scene JSONs
- TypeScript type definitions for all data structures
- Utility functions: D3 scales, layout helpers, canvas rendering
- Basic implementations: Scenes 0-2 (Hero, Timeline, Galaxy)

### 🚧 To Implement (Phase 2)
- Scenes 3-11 full implementations
- Smooth layout transitions (UMAP ↔ Timeline)
- Interactive tooltips and hover states
- Mobile responsive design
- Performance optimization (WebGL for 100k+ dots)
- Accessibility features

See **[app/README.md](app/README.md)** for detailed roadmap and architecture.

---

## Known Gaps
- No explicit segue markers or official tour IDs in source.
- Some festival venue slugs may vary; we match by common keywords and can expand this list in code.
- Frontend currently has Scenes 0-2 implemented; Scenes 3-11 are placeholders.
