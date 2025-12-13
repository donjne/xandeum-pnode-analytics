import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that calls a callback function at a specified interval
 * Automatically cleans up on unmount
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified or delay is null
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

/**
 * Hook that provides start/stop/reset controls for an interval
 */
export function useControllableInterval(
  callback: () => void,
  delay: number,
  options: {
    autoStart?: boolean;
    immediate?: boolean;
  } = {}
) {
  const { autoStart = true, immediate = false } = options;
  
  const savedCallback = useRef(callback);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(autoStart);

  // Update callback ref
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    // Call immediately if requested
    if (immediate) {
      savedCallback.current();
    }

    intervalIdRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);
    
    isRunningRef.current = true;
  }, [delay, immediate]);

  const stop = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  const reset = useCallback(() => {
    stop();
    start();
  }, [start, stop]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Auto-start on mount if specified
  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    start,
    stop,
    reset,
    toggle,
    isRunning: isRunningRef.current,
  };
}

/**
 * Hook for polling data with exponential backoff on errors
 */
export function usePolling(
  callback: () => Promise<void>,
  options: {
    interval?: number;
    enabled?: boolean;
    maxRetries?: number;
    onError?: (error: Error, retryCount: number) => void;
  } = {}
) {
  const {
    interval = 30000,
    enabled = true,
    maxRetries = 3,
    onError,
  } = options;

  const retryCountRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const poll = useCallback(async () => {
    try {
      await savedCallback.current();
      retryCountRef.current = 0; // Reset retry count on success

      if (enabled) {
        timeoutIdRef.current = setTimeout(poll, interval);
      }
    } catch (error) {
      retryCountRef.current += 1;

      if (onError) {
        onError(error as Error, retryCountRef.current);
      }

      if (retryCountRef.current < maxRetries && enabled) {
        // Exponential backoff: 2s, 4s, 8s, etc.
        const backoffDelay = Math.min(2000 * Math.pow(2, retryCountRef.current - 1), interval);
        timeoutIdRef.current = setTimeout(poll, backoffDelay);
      } else if (enabled) {
        // Max retries reached, continue with normal interval
        retryCountRef.current = 0;
        timeoutIdRef.current = setTimeout(poll, interval);
      }
    }
  }, [enabled, interval, maxRetries, onError]);

  useEffect(() => {
    if (!enabled) return;

    poll();

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [enabled, poll]);

  return {
    retryCount: retryCountRef.current,
  };
}