import { createJSONStorage, persist } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';

// Custom storage implementation for better error handling
const createCustomStorage = (): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      try {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(name);
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        if (typeof window === 'undefined') return;
        localStorage.setItem(name, value);
      } catch (error) {
        console.warn('Error writing to localStorage:', error);
      }
    },
    removeItem: (name: string): void => {
      try {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(name);
      } catch (error) {
        console.warn('Error removing from localStorage:', error);
      }
    },
  };
};

export const customStorage = createCustomStorage();
