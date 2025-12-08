/**
 * Favorites/Watchlist Management
 * Uses localStorage to persist user's favorite nodes
 */

const FAVORITES_KEY = 'xandeum-favorites';

export interface FavoriteNode {
  id: string;
  addedAt: number;
}

/**
 * Get all favorite node IDs
 */
export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    const favorites: FavoriteNode[] = JSON.parse(stored);
    return favorites.map(f => f.id);
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
}

/**
 * Check if a node is favorited
 */
export function isFavorite(nodeId: string): boolean {
  const favorites = getFavorites();
  return favorites.includes(nodeId);
}

/**
 * Add node to favorites
 */
export function addFavorite(nodeId: string): boolean {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites: FavoriteNode[] = stored ? JSON.parse(stored) : [];
    
    // Check if already exists
    if (favorites.some(f => f.id === nodeId)) {
      return false;
    }
    
    favorites.push({
      id: nodeId,
      addedAt: Date.now(),
    });
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return false;
  }
}

/**
 * Remove node from favorites
 */
export function removeFavorite(nodeId: string): boolean {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return false;
    
    const favorites: FavoriteNode[] = JSON.parse(stored);
    const filtered = favorites.filter(f => f.id !== nodeId);
    
    if (filtered.length === favorites.length) {
      return false; // Not found
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return false;
  }
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(nodeId: string): boolean {
  if (isFavorite(nodeId)) {
    removeFavorite(nodeId);
    return false;
  } else {
    addFavorite(nodeId);
    return true;
  }
}

/**
 * Get favorites count
 */
export function getFavoritesCount(): number {
  return getFavorites().length;
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear favorites:', error);
  }
}

/**
 * Get favorites with metadata
 */
export function getFavoritesWithMetadata(): FavoriteNode[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load favorites metadata:', error);
    return [];
  }
}

/**
 * Export favorites
 */
export function exportFavorites(): string {
  const favorites = getFavoritesWithMetadata();
  return JSON.stringify(favorites, null, 2);
}

/**
 * Import favorites
 */
export function importFavorites(jsonString: string): boolean {
  try {
    const favorites: FavoriteNode[] = JSON.parse(jsonString);
    
    // Validate structure
    if (!Array.isArray(favorites)) {
      throw new Error('Invalid favorites format');
    }
    
    for (const fav of favorites) {
      if (!fav.id || typeof fav.addedAt !== 'number') {
        throw new Error('Invalid favorite item');
      }
    }
    
    localStorage.setItem(FAVORITES_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Failed to import favorites:', error);
    return false;
  }
}
