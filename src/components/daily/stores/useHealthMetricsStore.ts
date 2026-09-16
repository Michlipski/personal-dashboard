import { createStore } from './create-store';
import { Storage } from './storage';
import { DailyHealthMetrics, EnergyLevel, MoodRating } from '../types';
import { calculateWaterMetrics } from '../utils/water';

export interface HealthMetricsStoreState {
  selectedDate: string;
  metrics: DailyHealthMetrics;
  isLoading: boolean;

  // Actions
  setDate: (date: string) => Promise<void>;
  addWaterGlass: () => Promise<void>;
  removeWaterGlass: () => Promise<void>;
  setWaterTarget: (targetGlasses: number) => Promise<void>;
  setEnergyLevel: (level: EnergyLevel) => Promise<void>;
  setMood: (mood: MoodRating, notes?: string) => Promise<void>;
  setMoodNotes: (notes: string) => Promise<void>;
  setScreenTime: (totalMinutes: number, productiveMinutes?: number, leisureMinutes?: number) => Promise<void>;
  resetMetrics: () => Promise<void>;
  startNewDayMetrics: (nextDate: string) => Promise<void>;
  loadCachedMetrics: (date: string) => Promise<void>;
  setMetrics: (metrics: DailyHealthMetrics) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const DEFAULT_HEALTH_METRICS: DailyHealthMetrics = {
  date: getTodayDateString(),
  waterIntake: {
    glasses: 0,
    targetGlasses: 12,
    milliliters: 0,
    percentageOfTarget: 0,
  },
  energyLevel: undefined,
  mood: undefined,
  moodNotes: '',
  screenTime: {
    totalMinutes: 0,
    productiveMinutes: 0,
    leisureMinutes: 0,
  },
  lastUpdated: new Date().toISOString(),
};

export const useHealthMetricsStore = createStore<HealthMetricsStoreState>((set, get) => ({
  selectedDate: getTodayDateString(),
  metrics: { ...DEFAULT_HEALTH_METRICS, date: getTodayDateString() },
  isLoading: false,

  setDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadCachedMetrics(date);
  },

  addWaterGlass: async () => {
    const current = get().metrics.waterIntake.glasses;
    const target = get().metrics.waterIntake.targetGlasses;
    const nextGlasses = current + 1;
    const waterCalc = calculateWaterMetrics(nextGlasses, target);

    const updated: DailyHealthMetrics = {
      ...get().metrics,
      waterIntake: waterCalc,
      lastUpdated: new Date().toISOString(),
    };

    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  removeWaterGlass: async () => {
    const current = get().metrics.waterIntake.glasses;
    const target = get().metrics.waterIntake.targetGlasses;
    const nextGlasses = Math.max(0, current - 1);
    const waterCalc = calculateWaterMetrics(nextGlasses, target);

    const updated: DailyHealthMetrics = {
      ...get().metrics,
      waterIntake: waterCalc,
      lastUpdated: new Date().toISOString(),
    };

    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  setWaterTarget: async (targetGlasses: number) => {
    const current = get().metrics.waterIntake.glasses;
    const waterCalc = calculateWaterMetrics(current, targetGlasses);

    const updated: DailyHealthMetrics = {
      ...get().metrics,
      waterIntake: waterCalc,
      lastUpdated: new Date().toISOString(),
    };

    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  setEnergyLevel: async (level: EnergyLevel) => {
    const updated: DailyHealthMetrics = {
      ...get().metrics,
      energyLevel: level,
      lastUpdated: new Date().toISOString(),
    };
    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  setMood: async (mood: MoodRating, notes?: string) => {
    const updated: DailyHealthMetrics = {
      ...get().metrics,
      mood,
      moodNotes: notes !== undefined ? notes : get().metrics.moodNotes,
      lastUpdated: new Date().toISOString(),
    };
    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  setMoodNotes: async (notes: string) => {
    const updated: DailyHealthMetrics = {
      ...get().metrics,
      moodNotes: notes,
      lastUpdated: new Date().toISOString(),
    };
    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  setScreenTime: async (totalMinutes: number, productiveMinutes?: number, leisureMinutes?: number) => {
    const updated: DailyHealthMetrics = {
      ...get().metrics,
      screenTime: {
        totalMinutes: Math.max(0, totalMinutes),
        productiveMinutes: productiveMinutes !== undefined ? Math.max(0, productiveMinutes) : (get().metrics.screenTime?.productiveMinutes ?? 0),
        leisureMinutes: leisureMinutes !== undefined ? Math.max(0, leisureMinutes) : (get().metrics.screenTime?.leisureMinutes ?? 0),
      },
      lastUpdated: new Date().toISOString(),
    };
    set({ metrics: updated });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updated)
    );
  },

  resetMetrics: async () => {
    const resetMetrics: DailyHealthMetrics = {
      ...DEFAULT_HEALTH_METRICS,
      date: get().selectedDate,
      lastUpdated: new Date().toISOString(),
    };
    set({ metrics: resetMetrics });
    await Storage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(resetMetrics)
    );
  },

  startNewDayMetrics: async (nextDate: string) => {
    set({ isLoading: true });
    try {
      const cacheKey = `health_metrics_cache_${nextDate}`;
      const raw = await Storage.getItem(cacheKey);
      let nextMetrics: DailyHealthMetrics;
      if (raw) {
        nextMetrics = JSON.parse(raw);
      } else {
        nextMetrics = {
          ...DEFAULT_HEALTH_METRICS,
          date: nextDate,
          lastUpdated: new Date().toISOString(),
        };
        await Storage.setItem(cacheKey, JSON.stringify(nextMetrics));
      }
      set({ selectedDate: nextDate, metrics: nextMetrics });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCachedMetrics: async (date: string) => {
    set({ isLoading: true });
    try {
      const raw = await Storage.getItem(`health_metrics_cache_${date}`);
      if (raw) {
        set({ metrics: JSON.parse(raw) });
      } else {
        set({
          metrics: {
            ...DEFAULT_HEALTH_METRICS,
            date,
            lastUpdated: new Date().toISOString(),
          },
        });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  setMetrics: (metrics: DailyHealthMetrics) => {
    set({ metrics });
  },
}));
