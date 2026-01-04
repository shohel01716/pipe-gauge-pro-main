// Quick favorites storage for common pipe sizes

const FAVORITES_KEY = "pipegauge_quick_favorites";

export interface QuickFavorite {
  id: string;
  nps: string;
  odMm: number;
  odInches: number;
  addedAt: number;
}

export function getQuickFavorites(): QuickFavorite[] {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (stored) {
    return JSON.parse(stored) as QuickFavorite[];
  }
  return [];
}

export function addQuickFavorite(favorite: Omit<QuickFavorite, "id" | "addedAt">): QuickFavorite {
  const favorites = getQuickFavorites();
  
  // Check if already exists
  const exists = favorites.some(f => f.nps === favorite.nps);
  if (exists) {
    return favorites.find(f => f.nps === favorite.nps)!;
  }
  
  const newFavorite: QuickFavorite = {
    ...favorite,
    id: crypto.randomUUID(),
    addedAt: Date.now(),
  };
  
  // Keep max 6 favorites
  const updated = [newFavorite, ...favorites].slice(0, 6);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return newFavorite;
}

export function removeQuickFavorite(nps: string): void {
  const favorites = getQuickFavorites();
  const filtered = favorites.filter(f => f.nps !== nps);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isQuickFavorite(nps: string): boolean {
  return getQuickFavorites().some(f => f.nps === nps);
}

export function toggleQuickFavorite(nps: string, odMm: number, odInches: number): boolean {
  if (isQuickFavorite(nps)) {
    removeQuickFavorite(nps);
    return false;
  } else {
    addQuickFavorite({ nps, odMm, odInches });
    return true;
  }
}
