/**
 * FavoriteButton Component
 * Star icon button to toggle favorite/watchlist status
 */

import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  nodeId: string;
  isFavorite: boolean;
  onToggle: (nodeId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({
  nodeId,
  isFavorite,
  onToggle,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Toggle favorite
    setLocalFavorite(!localFavorite);
    onToggle(nodeId);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${buttonSizeClasses[size]}
        rounded-full
        transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-yellow-500
        ${isAnimating ? 'scale-125' : 'scale-100'}
      `}
      title={localFavorite ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-label={localFavorite ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <div className="flex items-center gap-1.5">
        <Star
          className={`
            ${sizeClasses[size]}
            transition-all duration-200
            ${localFavorite 
              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]' 
              : 'text-gray-400 hover:text-yellow-400'
            }
            ${isAnimating ? 'rotate-12' : ''}
          `}
        />
        {showLabel && (
          <span className={`
            text-sm font-medium
            ${localFavorite ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}
          `}>
            {localFavorite ? 'Watchlisted' : 'Add to Watchlist'}
          </span>
        )}
      </div>
    </button>
  );
}
