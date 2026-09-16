/**
 * Time utility functions for Stage 1 Schedule
 */

export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return Math.max(0, Math.min(1439, hours * 60 + minutes));
}

export function minutesToTimeString(minutes: number): string {
  if (isNaN(minutes)) return '00:00';
  const normalized = ((Math.floor(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface TimeRecalculationInput {
  startTime: string;
  durationMinutes: number;
  endTime: string;
}

export function recalculateTime(
  changedField: 'startTime' | 'duration' | 'endTime',
  current: TimeRecalculationInput
): TimeRecalculationInput {
  const startMin = timeStringToMinutes(current.startTime);

  if (changedField === 'startTime' || changedField === 'duration') {
    // End time updates based on duration
    const newEndMin = (startMin + current.durationMinutes) % 1440;
    return {
      startTime: current.startTime,
      durationMinutes: current.durationMinutes,
      endTime: minutesToTimeString(newEndMin),
    };
  } else {
    // End time was edited -> recalculate duration
    const endMin = timeStringToMinutes(current.endTime);
    let diff = endMin - startMin;
    if (diff < 0) diff += 1440; // overnight wrap
    return {
      startTime: current.startTime,
      durationMinutes: diff,
      endTime: current.endTime,
    };
  }
}

export function getNextQuarterHour(currentTime: Date = new Date()): string {
  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const remainder = minutes % 15;
  const nextQuarter = minutes + (remainder === 0 ? 15 : 15 - remainder);
  return minutesToTimeString(nextQuarter);
}

export function formatMinutesToHoursDisplay(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getNextDayDateString(currentDateStr: string): string {
  if (!currentDateStr || typeof currentDateStr !== 'string') {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }
  const parts = currentDateStr.trim().split('-');
  if (parts.length !== 3) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  // Using UTC date to prevent any timezone shifts
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split('T')[0];
}
