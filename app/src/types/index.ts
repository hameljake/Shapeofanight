// Core data types matching the JSON schemas

export interface Performance {
  perf_id: string;
  show_id: string;
  show_date_iso: string;
  venue_slug: string;
  song_title: string;
  song_slug: string;
  set_label: string;
  position: number;
  duration_sec: number;
  x_umap: number;
  y_umap: number;
  role?: Role;
  jam_level?: JamLevel;
  era_label?: string;
  energy_score?: number;
}

export type Role = 'opener' | 'centerpiece' | 'landing' | 'closer' | 'encore' | 'other';
export type JamLevel = 0 | 1 | 2 | 3;
export type SetLabel = 'I' | 'II' | 'III' | 'E';

export interface SPACPerformance {
  song_title: string;
  set_label: SetLabel;
  position: number;
  duration_sec: number;
  jam_level: JamLevel;
  role: Role;
  slot_in_show: number;
  slot_norm_show: number;
  x_umap: number;
  y_umap: number;
}

export interface GalaxyNode {
  perf_id: string;
  x_umap: number;
  y_umap: number;
  show_id: string;
}

export interface RoleCentroid {
  role: Role;
  cx: number;
  cy: number;
  r75: number;
  n: number;
}

export interface EnergyCurvePoint {
  bin: number;
  median: number;
  q25: number;
  q75: number;
}

export interface SongTrail {
  song_slug: string;
  trail: Array<{
    era_label: string;
    x: number;
    y: number;
    n: number;
  }>;
}

export interface VenueAffinity {
  venue_slug: string;
  song_slug: string;
  song_title: string;
  affinity: number;
  count_at_venue: number;
}

export interface SpecialShow {
  show_id: string;
  show_date_iso: string;
  venue_slug: string;
  special_type: string;
  perf_count: number;
  longest_jam: string;
  longest_jam_duration: number;
  median_energy: number;
}

export interface ShowIndex {
  show_id: string;
  show_date_iso: string;
  venue_slug: string;
  year: number;
  era: string;
  opener: string;
  closer: string;
  encore: string;
  longest_jam: string;
}

// Scene-specific data types
export interface SceneData {
  spac_timeline?: SPACPerformance[];
  galaxy?: GalaxyNode[];
  show_to_performances?: Record<string, string[]>;
  role_centroids?: RoleCentroid[];
  perf_to_role?: Record<string, Role>;
  energy_curve_global?: EnergyCurvePoint[];
  spac_energy_curve?: EnergyCurvePoint[];
  jam_levels_by_perf?: Record<string, JamLevel>;
  song_trails?: SongTrail[];
  venue_affinity_selected?: Record<string, VenueAffinity[]>;
  specials_grid?: SpecialShow[];
  shows_index?: ShowIndex[];
}

// Scene configuration
export interface SceneConfig {
  id: number;
  name: string;
  dataFiles: string[];
  component: React.ComponentType<SceneProps>;
}

export interface SceneProps {
  data: SceneData;
  isActive: boolean;
  progress: number; // 0-1, how far through this scene
}

// Layout types
export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

