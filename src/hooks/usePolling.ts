import { useEffect, useRef } from 'react';

/**
 * Hook for polling/auto-refresh functionality
 */
export function usePolling(callback: () => void, interval: number = 30000, enabled: boolean = true) {
  const savedCallback = useRef<(() => void) | undefined>(undefined);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) return;

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    // Call immediately
    tick();

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}
