// Pipe size lookup tables with NPS, OD, and thread information

export interface PipeSize {
  nps: string;
  odInches: number;
  odMm: number;
  nptThreadsPerInch: number;
  bspThreadsPerInch: number;
  metricThread?: string;
}

export const PIPE_SIZES: PipeSize[] = [
  { nps: "1/8", odInches: 0.405, odMm: 10.3, nptThreadsPerInch: 27, bspThreadsPerInch: 28 },
  { nps: "1/4", odInches: 0.540, odMm: 13.7, nptThreadsPerInch: 18, bspThreadsPerInch: 19 },
  { nps: "3/8", odInches: 0.675, odMm: 17.1, nptThreadsPerInch: 18, bspThreadsPerInch: 19 },
  { nps: "1/2", odInches: 0.840, odMm: 21.3, nptThreadsPerInch: 14, bspThreadsPerInch: 14 },
  { nps: "3/4", odInches: 1.050, odMm: 26.7, nptThreadsPerInch: 14, bspThreadsPerInch: 14 },
  { nps: "1", odInches: 1.315, odMm: 33.4, nptThreadsPerInch: 11.5, bspThreadsPerInch: 11 },
  { nps: "1-1/4", odInches: 1.660, odMm: 42.2, nptThreadsPerInch: 11.5, bspThreadsPerInch: 11 },
  { nps: "1-1/2", odInches: 1.900, odMm: 48.3, nptThreadsPerInch: 11.5, bspThreadsPerInch: 11 },
  { nps: "2", odInches: 2.375, odMm: 60.3, nptThreadsPerInch: 11.5, bspThreadsPerInch: 11 },
  { nps: "2-1/2", odInches: 2.875, odMm: 73.0, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
  { nps: "3", odInches: 3.500, odMm: 88.9, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
  { nps: "3-1/2", odInches: 4.000, odMm: 101.6, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
  { nps: "4", odInches: 4.500, odMm: 114.3, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
  { nps: "5", odInches: 5.563, odMm: 141.3, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
  { nps: "6", odInches: 6.625, odMm: 168.3, nptThreadsPerInch: 8, bspThreadsPerInch: 11 },
];

export const METRIC_PIPES = [
  { size: "DN6", odMm: 10.2, metricThread: "M10x1" },
  { size: "DN8", odMm: 13.5, metricThread: "M12x1.5" },
  { size: "DN10", odMm: 17.2, metricThread: "M16x1.5" },
  { size: "DN15", odMm: 21.3, metricThread: "M20x1.5" },
  { size: "DN20", odMm: 26.9, metricThread: "M24x1.5" },
  { size: "DN25", odMm: 33.7, metricThread: "M30x2" },
  { size: "DN32", odMm: 42.4, metricThread: "M36x2" },
  { size: "DN40", odMm: 48.3, metricThread: "M42x2" },
  { size: "DN50", odMm: 60.3, metricThread: "M52x2" },
  { size: "DN65", odMm: 76.1, metricThread: "M64x2" },
  { size: "DN80", odMm: 88.9, metricThread: "M76x2" },
  { size: "DN100", odMm: 114.3, metricThread: "M100x2" },
];

export type PipeMaterial = "PVC" | "Copper" | "Steel" | "PEX";

export const PIPE_MATERIALS: { value: PipeMaterial; label: string; color: string }[] = [
  { value: "PVC", label: "PVC", color: "#E5E7EB" },
  { value: "Copper", label: "Copper", color: "#D97706" },
  { value: "Steel", label: "Steel", color: "#6B7280" },
  { value: "PEX", label: "PEX", color: "#EF4444" },
];

export type ThreadType = "NPT" | "BSP" | "Metric";

export function findClosestPipeSize(diameterMm: number): PipeSize | null {
  if (diameterMm < 5 || diameterMm > 200) return null;
  
  let closest: PipeSize | null = null;
  let minDiff = Infinity;
  
  for (const size of PIPE_SIZES) {
    const diff = Math.abs(size.odMm - diameterMm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }
  
  // Only return if within 10% tolerance
  if (closest && minDiff <= closest.odMm * 0.1) {
    return closest;
  }
  
  return closest;
}

export function mmToInches(mm: number): number {
  return mm / 25.4;
}

export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

export function getThreadInfo(pipeSize: PipeSize, threadType: ThreadType): string {
  switch (threadType) {
    case "NPT":
      return `${pipeSize.nptThreadsPerInch} TPI`;
    case "BSP":
      return `${pipeSize.bspThreadsPerInch} TPI`;
    case "Metric":
      const metric = METRIC_PIPES.find(m => Math.abs(m.odMm - pipeSize.odMm) < 5);
      return metric?.metricThread || "N/A";
    default:
      return "N/A";
  }
}
