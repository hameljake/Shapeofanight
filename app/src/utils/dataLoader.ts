import { SceneData } from '@/types';
// Eagerly import all JSON files in scenes so Vite can bundle them correctly
const sceneJsonModules = import.meta.glob('../../scenes/*.json', { eager: true, import: 'default' }) as Record<string, any>;

// Build a filename -> data map (e.g., 'spac_2014_07_04_timeline.json' => data)
const filenameToData: Record<string, any> = Object.fromEntries(
  Object.entries(sceneJsonModules).map(([path, data]) => [path.split('/').pop()!, data])
);

// Map scene numbers to required data files
const SCENE_DATA_MAP: Record<number, string[]> = {
  0: ['spac_2014_07_04_timeline.json'],
  1: ['spac_2014_07_04_timeline.json'],
  2: ['galaxy_min.json', 'show_to_performances.json'],
  3: ['galaxy_min.json', 'role_centroids.json', 'perf_to_role.json'],
  4: ['energy_curve_global.json', 'spac_energy_curve.json'],
  5: ['galaxy_min.json', 'jam_levels_by_perf.json'],
  6: ['galaxy_min.json', 'song_trails.json'],
  7: ['galaxy_min.json', 'venue_affinity_selected.json'],
  8: ['specials_grid.json'],
  9: ['galaxy_min.json', 'show_to_performances.json'], // shows_index.json when available
  10: [], // Static content
  11: ['spac_2014_07_04_timeline.json', 'galaxy_min.json'],
};

// Cache for loaded data
const dataCache: Map<string, any> = new Map();

export const loadSceneData = async (sceneNumber: number): Promise<SceneData> => {
  const files = SCENE_DATA_MAP[sceneNumber] || [];
  const sceneData: SceneData = {};

  await Promise.all(
    files.map(async (filename) => {
      if (dataCache.has(filename)) {
        assignDataToScene(sceneData, filename, dataCache.get(filename));
        return;
      }

      const data = filenameToData[filename];
      if (!data) {
        console.error(`Failed to load ${filename}: not found in scenes`);
        return;
      }

      dataCache.set(filename, data);
      assignDataToScene(sceneData, filename, data);
    })
  );

  return sceneData;
};

// Helper to map filenames to SceneData properties
const assignDataToScene = (sceneData: SceneData, filename: string, data: any) => {
  switch (filename) {
    case 'spac_2014_07_04_timeline.json':
      sceneData.spac_timeline = data;
      break;
    case 'galaxy_min.json':
      sceneData.galaxy = data;
      break;
    case 'show_to_performances.json':
      sceneData.show_to_performances = data;
      break;
    case 'role_centroids.json':
      sceneData.role_centroids = data;
      break;
    case 'perf_to_role.json':
      sceneData.perf_to_role = data;
      break;
    case 'energy_curve_global.json':
      sceneData.energy_curve_global = data;
      break;
    case 'spac_energy_curve.json':
      sceneData.spac_energy_curve = data;
      break;
    case 'jam_levels_by_perf.json':
      sceneData.jam_levels_by_perf = data;
      break;
    case 'song_trails.json':
      sceneData.song_trails = data;
      break;
    case 'venue_affinity_selected.json':
      sceneData.venue_affinity_selected = data;
      break;
    case 'specials_grid.json':
      sceneData.specials_grid = data;
      break;
  }
};

// Preload critical data
export const preloadCriticalData = async () => {
  return loadSceneData(0);
};

