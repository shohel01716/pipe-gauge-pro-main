import { PipeMaterial, ThreadType } from "./pipeData";

export interface SavedMeasurement {
  id: string;
  timestamp: number;
  diameterMm: number;
  diameterInches: number;
  nps: string;
  threadType: ThreadType;
  threadInfo: string;
  material: PipeMaterial;
  label: string;
  notes: string;
  isFavorite: boolean;
}

const STORAGE_KEY = "pipegauge_measurements";

export function getSavedMeasurements(): SavedMeasurement[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as SavedMeasurement[];
  }
  return [];
}

export function saveMeasurement(measurement: Omit<SavedMeasurement, "id" | "timestamp">): SavedMeasurement {
  const measurements = getSavedMeasurements();
  const newMeasurement: SavedMeasurement = {
    ...measurement,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  measurements.unshift(newMeasurement);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  return newMeasurement;
}

export function updateMeasurement(id: string, updates: Partial<SavedMeasurement>): void {
  const measurements = getSavedMeasurements();
  const index = measurements.findIndex(m => m.id === id);
  if (index !== -1) {
    measurements[index] = { ...measurements[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  }
}

export function deleteMeasurement(id: string): void {
  const measurements = getSavedMeasurements();
  const filtered = measurements.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function toggleFavorite(id: string): void {
  const measurements = getSavedMeasurements();
  const index = measurements.findIndex(m => m.id === id);
  if (index !== -1) {
    measurements[index].isFavorite = !measurements[index].isFavorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  }
}
