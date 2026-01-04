// Usage tracking for free tier limits

const STORAGE_KEY = "pipegauge_usage";
const DAILY_LIMIT = 3;

interface UsageData {
  date: string;
  count: number;
  isPro: boolean;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getUsageData(): UsageData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored) as UsageData;
    if (data.date === getTodayKey()) {
      return data;
    }
  }
  return { date: getTodayKey(), count: 0, isPro: false };
}

export function incrementUsage(): UsageData {
  const data = getUsageData();
  data.count += 1;
  data.date = getTodayKey();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function canMeasure(): boolean {
  const data = getUsageData();
  if (data.isPro) return true;
  return data.count < DAILY_LIMIT;
}

export function getRemainingMeasurements(): number {
  const data = getUsageData();
  if (data.isPro) return Infinity;
  return Math.max(0, DAILY_LIMIT - data.count);
}

export function setProStatus(isPro: boolean): void {
  const data = getUsageData();
  data.isPro = isPro;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isProUser(): boolean {
  return getUsageData().isPro;
}
