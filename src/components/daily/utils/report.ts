import { ScheduleBlock, DailyHealthMetrics, DailyReportPayload } from '../types';
import { Storage } from '../stores/storage';

export function generateDailyReport(
  date: string,
  blocks: ScheduleBlock[],
  healthMetrics: DailyHealthMetrics
): DailyReportPayload {
  // 1. Separate duration blocks from zero-duration habits
  const durationBlocks = blocks.filter((b) => b.type !== 'zero_duration');
  const zeroDurationItems = blocks.filter((b) => b.type === 'zero_duration');

  // 2. Compute duration minutes
  const totalScheduledMinutes = durationBlocks.reduce((acc, b) => acc + b.durationMinutes, 0);
  const completedMinutes = durationBlocks
    .filter((b) => b.status === 'completed')
    .reduce((acc, b) => acc + b.durationMinutes, 0);

  const completionRate =
    totalScheduledMinutes > 0
      ? Math.round((completedMinutes / totalScheduledMinutes) * 100) / 100
      : 0;

  // 3. Compute zero-duration completion stats
  const zeroDurationItemsTotal = zeroDurationItems.length;
  const zeroDurationItemsCompleted = zeroDurationItems.filter(
    (b) => b.status === 'completed'
  ).length;

  // 4. Assemble canonical payload
  return {
    reportVersion: '1.0',
    generatedAt: new Date().toISOString(),
    date,
    summary: {
      totalScheduledMinutes,
      completedMinutes,
      completionRate,
      zeroDurationItemsTotal,
      zeroDurationItemsCompleted,
    },
    scheduleItems: blocks.map((b) => ({
      id: b.id,
      title: b.title,
      type: b.type,
      sessionType: b.sessionType,
      startTime: b.startTime,
      durationMinutes: b.durationMinutes,
      endTime: b.endTime,
      status: b.status,
      completedAt: b.completedAt,
      missedAt: b.missedAt,
      objectiveId: b.objectiveId,
      notes: b.notes,
    })),
    healthVitals: {
      date: healthMetrics.date,
      waterIntake: { ...healthMetrics.waterIntake },
      energyLevel: healthMetrics.energyLevel,
      mood: healthMetrics.mood,
      moodNotes: healthMetrics.moodNotes,
      screenTime: { ...healthMetrics.screenTime },
      lastUpdated: healthMetrics.lastUpdated,
    },
  };
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard write failed, attempting fallback', err);
  }

  // Fallback for environments where navigator.clipboard might not be directly available
  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

export async function saveDailyReportSnapshot(payload: DailyReportPayload): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(payload, null, 2);

    // 1. Save snapshot to Local Client Storage
    const archiveKey = `daily_reports_archive_${payload.date}`;
    await Storage.setItem(archiveKey, jsonString);

    // 2. Update master index of archived report dates
    const indexRaw = await Storage.getItem('archived_report_dates');
    const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    if (!dates.includes(payload.date)) {
      dates.push(payload.date);
      await Storage.setItem('archived_report_dates', JSON.stringify(dates));
    }

    return true;
  } catch (error) {
    console.error('Failed to save daily report snapshot:', error);
    return false;
  }
}

export async function getArchivedReportDates(): Promise<string[]> {
  try {
    const indexRaw = await Storage.getItem('archived_report_dates');
    const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    // Return sorted chronologically descending (latest date first)
    return dates.sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export async function getArchivedDailyReport(date: string): Promise<DailyReportPayload | null> {
  try {
    const raw = await Storage.getItem(`daily_reports_archive_${date}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function deleteArchivedReport(date: string): Promise<boolean> {
  try {
    await Storage.removeItem(`daily_reports_archive_${date}`);
    const indexRaw = await Storage.getItem('archived_report_dates');
    const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    const updated = dates.filter((d) => d !== date);
    await Storage.setItem('archived_report_dates', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to delete archived report:', error);
    return false;
  }
}

export const SAMPLE_ARCHIVED_REPORT: DailyReportPayload = {
  reportVersion: '1.0',
  generatedAt: '2026-09-13T21:30:00.000Z',
  date: '2026-09-13',
  summary: {
    totalScheduledMinutes: 300,
    completedMinutes: 240,
    completionRate: 0.8,
    zeroDurationItemsTotal: 3,
    zeroDurationItemsCompleted: 3,
  },
  scheduleItems: [
    {
      id: 'sample-001',
      title: 'Morning Sunlight & Hydration',
      type: 'zero_duration',
      sessionType: 'habit_checkpoint',
      startTime: '08:00',
      durationMinutes: 0,
      endTime: '08:00',
      status: 'completed',
      completedAt: '2026-09-13T08:05:00.000Z',
    },
    {
      id: 'sample-002',
      title: 'System Architecture Design',
      type: 'strict',
      sessionType: 'focus_deep_work',
      startTime: '09:00',
      durationMinutes: 120,
      endTime: '11:00',
      status: 'completed',
      completedAt: '2026-09-13T11:00:00.000Z',
    },
    {
      id: 'sample-003',
      title: '🎹 Piano Repertoire Practice',
      type: 'loose',
      sessionType: 'deliberate_practice',
      startTime: '14:00',
      durationMinutes: 60,
      endTime: '15:00',
      status: 'completed',
      completedAt: '2026-09-13T15:00:00.000Z',
    },
    {
      id: 'sample-004',
      title: 'Evening Code Review',
      type: 'loose',
      sessionType: 'focus_deep_work',
      startTime: '16:00',
      durationMinutes: 120,
      endTime: '18:00',
      status: 'missed',
      missedAt: '2026-09-13T18:00:00.000Z',
    },
    {
      id: 'sample-005',
      title: 'Evening Magnesium & Mobility',
      type: 'zero_duration',
      sessionType: 'habit_checkpoint',
      startTime: '21:30',
      durationMinutes: 0,
      endTime: '21:30',
      status: 'completed',
      completedAt: '2026-09-13T21:32:00.000Z',
    },
  ],
  healthVitals: {
    date: '2026-09-13',
    waterIntake: {
      glasses: 10,
      targetGlasses: 12,
      milliliters: 2500,
      percentageOfTarget: 0.83,
    },
    energyLevel: 'high',
    mood: 'great',
    moodNotes: 'High productivity flow throughout afternoon practice and systems coding.',
    screenTime: {
      totalMinutes: 360,
      productiveMinutes: 300,
      leisureMinutes: 60,
    },
    lastUpdated: '2026-09-13T21:30:00.000Z',
  },
};

export async function seedSampleArchivedReportIfEmpty(): Promise<void> {
  try {
    const dates = await getArchivedReportDates();
    if (dates.length === 0) {
      await saveDailyReportSnapshot(SAMPLE_ARCHIVED_REPORT);
    }
  } catch {
    // ignore
  }
}

export async function exportDailyReport(payload: DailyReportPayload): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(payload, null, 2);

    // 1. Copy to System Clipboard
    await copyTextToClipboard(jsonString);

    // 2. Save snapshot to Local Client Storage
    await saveDailyReportSnapshot(payload);

    return true;
  } catch (error) {
    console.error('Failed to export daily report:', error);
    return false;
  }
}
