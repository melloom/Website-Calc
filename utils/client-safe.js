import { useState, useEffect } from 'react';

/**
 * Hook to safely use client-side only code
 * Returns true only after component has mounted on the client
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Safely access localStorage with error handling
 * Only works on client side
 */
export function safeLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    };
  }

  return {
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error writing to localStorage:', error);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing from localStorage:', error);
      }
    },
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Error clearing localStorage:', error);
      }
    }
  };
}

/**
 * Safely access window object
 * Only works on client side
 */
export function safeWindow() {
  if (typeof window === 'undefined') {
    return {
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollY: 0,
      scrollTo: () => {}
    };
  }

  return window;
}
