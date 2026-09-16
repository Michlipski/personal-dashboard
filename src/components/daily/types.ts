/**
 * Stage 1 Daily Types & Contracts
 * Based on docs/technical-documentation/stage-1
 */

export type ScheduleBlockType = 'strict' | 'loose' | 'zero_duration';

export type ItemStatus = 'pending' | 'completed' | 'missed';

export type SessionType =
  | 'focus_deep_work'
  | 'deliberate_practice'
  | 'routine_maintenance'
  | 'appointment'
  | 'habit_checkpoint'
  | 'rest_recovery';

export interface ScheduleBlock {
  id: string;
  title: string;
  type: ScheduleBlockType;
  sessionType: SessionType;
  startTime: string; // "HH:mm" e.g. "13:30"
  durationMinutes: number; // 0 for zero-duration items
  endTime: string; // "HH:mm" e.g. "14:15"
  status: ItemStatus;
  completedAt?: string;
  missedAt?: string;
  objectiveId?: string;
  notes?: string;
}

export interface PositionedZeroDurationItem {
  block: ScheduleBlock;
  anchorY: number; // Exact coordinate on 24h timeline (px)
  renderedY: number; // Adjusted coordinate after collision resolution (px)
  isDisplaced: boolean; // renderedY > anchorY
}

export type EnergyLevel = 'high' | 'medium' | 'low';

export type MoodRating = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

export interface DailyHealthMetrics {
  date: string; // "YYYY-MM-DD"
  waterIntake: {
    glasses: number;
    targetGlasses: number;
    milliliters: number;
    percentageOfTarget: number;
  };
  energyLevel?: EnergyLevel;
  mood?: MoodRating;
  moodNotes?: string;
  screenTime: {
    totalMinutes: number;
    productiveMinutes?: number;
    leisureMinutes?: number;
  };
  lastUpdated: string; // ISO 8601
}

export interface DailyReportSummary {
  totalScheduledMinutes: number;
  completedMinutes: number;
  completionRate: number; // 0.00 to 1.00
  zeroDurationItemsTotal: number;
  zeroDurationItemsCompleted: number;
}

export interface DailyReportPayload {
  reportVersion: '1.0';
  generatedAt: string; // ISO 8601
  date: string; // "YYYY-MM-DD"
  summary: DailyReportSummary;
  scheduleItems: ScheduleBlock[];
  healthVitals: DailyHealthMetrics;
}

export type DailyTabMode = 'schedule' | 'vitals' | 'reports';
