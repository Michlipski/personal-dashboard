/**
 * Universal Storage adapter conforming to AsyncStorage API
 * Uses localStorage on web / browser and an in-memory Map fallback
 */

const memoryStore = new Map<string, string>();

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }
    memoryStore.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
      return;
    }
    memoryStore.delete(key);
  },

  async clear(): Promise<void> {
    if (isLocalStorageAvailable()) {
      window.localStorage.clear();
      return;
    }
    memoryStore.clear();
  },
};
