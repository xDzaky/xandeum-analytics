/**
 * React hook for managing favorites with reactive updates
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getFavorites,
  isFavorite,
  toggleFavorite as toggleFavoriteUtil,
  getFavoritesCount,
} from '../utils/favorites';

// Custom event for cross-component synchronization
const FAVORITES_CHANGED_EVENT = 'favorites-changed';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(getFavorites());
      setCount(getFavoritesCount());
    };

    loadFavorites();

    // Listen for favorites changes from other components
    const handleFavoritesChanged = () => {
      loadFavorites();
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
    };
  }, []);

  const toggleFavorite = useCallback((nodeId: string) => {
    const newState = toggleFavoriteUtil(nodeId);
    setFavorites(getFavorites());
    setCount(getFavoritesCount());

    // Notify other components
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));

    return newState;
  }, []);

  const checkIsFavorite = useCallback((nodeId: string) => {
    return isFavorite(nodeId);
  }, []);

  return {
    favorites,
    count,
    toggleFavorite,
    isFavorite: checkIsFavorite,
  };
}
