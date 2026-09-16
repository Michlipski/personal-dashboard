import { ItemStatus, ScheduleBlock } from '../types';
import { createStore } from './create-store';
import { Storage } from './storage';

export interface ScheduleStoreState {
  selectedDate: string; // "YYYY-MM-DD"
  blocks: ScheduleBlock[];
  isLoading: boolean;

  // Actions
  setDate: (date: string) => Promise<void>;
  addBlock: (block: Omit<ScheduleBlock, 'id'>) => Promise<void>;
  updateBlock: (id: string, updates: Partial<ScheduleBlock>) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  resetSchedule: () => Promise<void>;
  startNewDaySchedule: (nextDate: string) => Promise<void>;
  loadCachedSchedule: (date: string) => Promise<void>;
  setBlocks: (blocks: ScheduleBlock[]) => void;
}

export const INITIAL_SCHEDULE_BLOCKS: ScheduleBlock[] = [
  // {
  //   id: 'item-001',
  //   title: 'Take Morning Vitamin D3 & K2',
  //   type: 'zero_duration',
  //   sessionType: 'habit_checkpoint',
  //   startTime: '08:00',
  //   durationMinutes: 0,
  //   endTime: '08:00',
  //   status: 'completed',
  //   completedAt: new Date().toISOString(),
  //   notes: 'Taken with breakfast fat source',
  // },
  // {
  //   id: 'item-002',
  //   title: 'Architectural Design Review',
  //   type: 'strict',
  //   sessionType: 'appointment',
  //   startTime: '09:00',
  //   durationMinutes: 60,
  //   endTime: '10:00',
  //   status: 'completed',
  //   completedAt: new Date().toISOString(),
  //   notes: 'Review Stage 1 core services specs',
  // },
  // {
  //   id: 'item-003',
  //   title: 'Post-Lunch Hydration Check',
  //   type: 'zero_duration',
  //   sessionType: 'habit_checkpoint',
  //   startTime: '13:00',
  //   durationMinutes: 0,
  //   endTime: '13:00',
  //   status: 'pending',
  // },
  // {
  //   id: 'item-004',
  //   title: 'Afternoon Meds',
  //   type: 'zero_duration',
  //   sessionType: 'habit_checkpoint',
  //   startTime: '13:00',
  //   durationMinutes: 0,
  //   endTime: '13:00',
  //   status: 'pending',
  // },
  // {
  //   id: 'item-005',
  //   title: '🎹 Piano Practice: Chopin Nocturne Op. 9 No. 2',
  //   type: 'loose',
  //   sessionType: 'deliberate_practice',
  //   startTime: '13:30',
  //   durationMinutes: 45,
  //   endTime: '14:15',
  //   status: 'completed',
  //   completedAt: new Date().toISOString(),
  //   objectiveId: 'obj-piano-mastery',
  //   notes: 'Focused strictly on Page 1 measures 8-12 hands together.',
  // },
  // {
  //   id: 'item-006',
  //   title: 'Rust Systems Engine Development',
  //   type: 'loose',
  //   sessionType: 'focus_deep_work',
  //   startTime: '15:00',
  //   durationMinutes: 120,
  //   endTime: '17:00',
  //   status: 'pending',
  //   notes: 'Stage 1 scheduler memory layout and testing',
  // },
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useScheduleStore = createStore<ScheduleStoreState>((set, get) => ({
  selectedDate: getTodayDateString(),
  blocks: INITIAL_SCHEDULE_BLOCKS,
  isLoading: false,

  setDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadCachedSchedule(date);
  },

  addBlock: async (blockData) => {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newBlock: ScheduleBlock = { ...blockData, id };
    const updated = [...get().blocks, newBlock];
    set({ blocks: updated });

    const cacheKey = `schedule_cache_${get().selectedDate}`;
    await Storage.setItem(cacheKey, JSON.stringify(updated));
  },

  updateBlock: async (id, updates) => {
    const updated = get().blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    set({ blocks: updated });

    const cacheKey = `schedule_cache_${get().selectedDate}`;
    await Storage.setItem(cacheKey, JSON.stringify(updated));
  },

  cycleStatus: async (id: string) => {
    const nextStatusMap: Record<ItemStatus, ItemStatus> = {
      pending: 'completed',
      completed: 'missed',
      missed: 'pending',
    };

    const updated = get().blocks.map((b) => {
      if (b.id !== id) return b;
      const nextStatus = nextStatusMap[b.status];
      return {
        ...b,
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
        missedAt: nextStatus === 'missed' ? new Date().toISOString() : undefined,
      };
    });

    set({ blocks: updated });
    const cacheKey = `schedule_cache_${get().selectedDate}`;
    await Storage.setItem(cacheKey, JSON.stringify(updated));
  },

  deleteBlock: async (id: string) => {
    const updated = get().blocks.filter((b) => b.id !== id);
    set({ blocks: updated });
    const cacheKey = `schedule_cache_${get().selectedDate}`;
    await Storage.setItem(cacheKey, JSON.stringify(updated));
  },

  resetSchedule: async () => {
    const resetBlocks = get().blocks.map((b) => ({
      ...b,
      status: 'pending' as const,
      completedAt: undefined,
      missedAt: undefined,
    }));
    set({ blocks: resetBlocks });
    const cacheKey = `schedule_cache_${get().selectedDate}`;
    await Storage.setItem(cacheKey, JSON.stringify(resetBlocks));
  },

  startNewDaySchedule: async (nextDate: string) => {
    set({ isLoading: true });
    try {
      const cacheKey = `schedule_cache_${nextDate}`;
      const raw = await Storage.getItem(cacheKey);
      let nextBlocks: ScheduleBlock[];
      if (raw) {
        nextBlocks = JSON.parse(raw);
      } else {
        // Carry forward schedule blocks with all statuses reset to pending
        nextBlocks = get().blocks.map((b) => ({
          ...b,
          status: 'pending' as const,
          completedAt: undefined,
          missedAt: undefined,
        }));
        await Storage.setItem(cacheKey, JSON.stringify(nextBlocks));
      }
      set({ selectedDate: nextDate, blocks: nextBlocks });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCachedSchedule: async (date: string) => {
    set({ isLoading: true });
    try {
      const cacheKey = `schedule_cache_${date}`;
      const raw = await Storage.getItem(cacheKey);
      if (raw) {
        set({ blocks: JSON.parse(raw) });
      } else if (date === getTodayDateString()) {
        set({ blocks: INITIAL_SCHEDULE_BLOCKS });
      } else {
        set({ blocks: [] });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  setBlocks: (blocks: ScheduleBlock[]) => {
    set({ blocks });
  },
}));
