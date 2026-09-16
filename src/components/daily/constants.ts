/**
 * Stage 1 Daily Constants & Design Tokens
 */

import { ItemStatus, SessionType } from "./types";

export const TIMELINE_HOUR_HEIGHT = 64; // px per hour (total: 24 * 64 = 1536px)
export const ZERO_DURATION_CARD_HEIGHT = 40; // 32px height + 8px margin
export const DEFAULT_WATER_TARGET_GLASSES = 12; // 12 * 250ml = 3000ml target
export const ML_PER_GLASS = 250;

export const WATER_GRADIENT_STOPS = [
  { offset: '0%', color: '#EF4444' },   // Red (0-1 glass)
  { offset: '20%', color: '#F97316' },  // Orange (2 glasses)
  { offset: '40%', color: '#EAB308' },  // Yellow (3-4 glasses)
  { offset: '60%', color: '#FFFFFF' },  // White baseline (5 glasses)
  { offset: '80%', color: '#38BDF8' },  // Sky Blue (6-7 glasses)
  { offset: '100%', color: '#4F46E5' }, // Deep Indigo (8+ glasses)
] as const;

export const WATER_GRADIENT_CSS =
  'linear-gradient(90deg, #EF4444 0%, #F97316 20%, #EAB308 40%, #FFFFFF 60%, #38BDF8 80%, #4F46E5 100%)';


export const SESSION_TYPES: SessionType[] = [
  'focus_deep_work',
  'deliberate_practice',
  'routine_maintenance',
  'appointment',
  'habit_checkpoint',
  'rest_recovery',
];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  focus_deep_work: 'Focus / Deep Work',
  deliberate_practice: 'Deliberate Practice',
  routine_maintenance: 'Routine Maintenance',
  appointment: 'Appointment',
  habit_checkpoint: 'Habit Checkpoint',
  rest_recovery: 'Rest & Recovery',
};

export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  focus_deep_work: '#3B82F6',       // Career / Blue
  deliberate_practice: '#F59E0B',   // Craft / Amber
  routine_maintenance: '#64748B',   // Slate
  appointment: '#EC4899',           // Rose / Pink
  habit_checkpoint: '#10B981',      // Health / Emerald
  rest_recovery: '#8B5CF6',         // Violet
};

export const STATUS_COLORS: Record<ItemStatus, string> = {
  pending: '#94A3B8',
  completed: '#10B981', // Emerald
  missed: '#EF4444',    // Red / Coral
} as const;
