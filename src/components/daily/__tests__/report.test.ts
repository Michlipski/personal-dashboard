import test from 'node:test';
import assert from 'node:assert';
import {
  generateDailyReport,
  saveDailyReportSnapshot,
  getArchivedReportDates,
  getArchivedDailyReport,
  deleteArchivedReport,
} from '../utils/report';
import { ScheduleBlock, DailyHealthMetrics } from '../types';

const mockHealthMetrics: DailyHealthMetrics = {
  date: '2026-09-09',
  waterIntake: {
    glasses: 7,
    targetGlasses: 8,
    milliliters: 1750,
    percentageOfTarget: 0.88,
  },
  energyLevel: 'medium',
  mood: 'good',
  moodNotes: 'Sustained good mental clarity during afternoon piano practice session.',
  screenTime: {
    totalMinutes: 330,
    productiveMinutes: 270,
    leisureMinutes: 60,
  },
  lastUpdated: '2026-09-09T21:45:00.000Z',
};

const mockBlocks: ScheduleBlock[] = [
  {
    id: 'item-001',
    title: 'Take Morning Vitamin D3 & K2',
    type: 'zero_duration',
    sessionType: 'habit_checkpoint',
    startTime: '08:00',
    durationMinutes: 0,
    endTime: '08:00',
    status: 'completed',
    completedAt: '2026-09-09T08:05:12.000Z',
  },
  {
    id: 'item-002',
    title: 'Architectural Design Review',
    type: 'strict',
    sessionType: 'appointment',
    startTime: '09:00',
    durationMinutes: 60,
    endTime: '10:00',
    status: 'completed',
    completedAt: '2026-09-09T10:02:00.000Z',
  },
  {
    id: 'item-003',
    title: '🎹 Piano Practice: Chopin Nocturne Op. 9 No. 2',
    type: 'loose',
    sessionType: 'deliberate_practice',
    startTime: '13:30',
    durationMinutes: 45,
    endTime: '14:15',
    status: 'completed',
    completedAt: '2026-09-09T14:18:22.000Z',
  },
  {
    id: 'item-004',
    title: 'Rust Systems Engine Development',
    type: 'loose',
    sessionType: 'focus_deep_work',
    startTime: '15:00',
    durationMinutes: 120,
    endTime: '17:00',
    status: 'missed',
  },
  {
    id: 'item-005',
    title: 'Evening Meditation',
    type: 'zero_duration',
    sessionType: 'habit_checkpoint',
    startTime: '21:00',
    durationMinutes: 0,
    endTime: '21:00',
    status: 'pending',
  },
];

test('Daily Report Utilities - generateDailyReport', async (t) => {
  await t.test('assembles canonical Schema v1.0 payload with correct mathematical summary', () => {
    const report = generateDailyReport('2026-09-09', mockBlocks, mockHealthMetrics);

    assert.strictEqual(report.reportVersion, '1.0');
    assert.strictEqual(report.date, '2026-09-09');
    assert.ok(report.generatedAt);

    // Duration items:
    // item-002: 60m (completed)
    // item-003: 45m (completed)
    // item-004: 120m (missed)
    // Total scheduled = 60 + 45 + 120 = 225m
    // Total completed = 60 + 45 = 105m
    // Completion rate = 105 / 225 = 0.4666... -> 0.47
    assert.strictEqual(report.summary.totalScheduledMinutes, 225);
    assert.strictEqual(report.summary.completedMinutes, 105);
    assert.strictEqual(report.summary.completionRate, 0.47);

    // Zero-duration items:
    // item-001 (completed), item-005 (pending)
    // Total = 2, Completed = 1
    assert.strictEqual(report.summary.zeroDurationItemsTotal, 2);
    assert.strictEqual(report.summary.zeroDurationItemsCompleted, 1);

    // Vitals check
    assert.strictEqual(report.healthVitals.waterIntake.glasses, 7);
    assert.strictEqual(report.healthVitals.energyLevel, 'medium');
    assert.strictEqual(report.healthVitals.mood, 'good');

    // Items list
    assert.strictEqual(report.scheduleItems.length, 5);
  });

  await t.test('handles empty block list without NaN or division by zero', () => {
    const report = generateDailyReport('2026-09-09', [], mockHealthMetrics);
    assert.strictEqual(report.summary.totalScheduledMinutes, 0);
    assert.strictEqual(report.summary.completedMinutes, 0);
    assert.strictEqual(report.summary.completionRate, 0);
    assert.strictEqual(report.summary.zeroDurationItemsTotal, 0);
    assert.strictEqual(report.summary.zeroDurationItemsCompleted, 0);
  });

  await t.test('calculates 100% completion rate when all scheduled blocks are completed', () => {
    const completedBlocks: ScheduleBlock[] = [
      {
        id: '1',
        title: 'Deep Work',
        type: 'strict',
        sessionType: 'focus_deep_work',
        startTime: '09:00',
        durationMinutes: 120,
        endTime: '11:00',
        status: 'completed',
      },
    ];

    const report = generateDailyReport('2026-09-09', completedBlocks, mockHealthMetrics);
    assert.strictEqual(report.summary.totalScheduledMinutes, 120);
    assert.strictEqual(report.summary.completedMinutes, 120);
    assert.strictEqual(report.summary.completionRate, 1);
  });
});

test('Daily Report Archiving - saveDailyReportSnapshot and queries', async (t) => {
  await t.test('archives daily report snapshot and indexes date in master list', async () => {
    const report = generateDailyReport('2026-09-15', mockBlocks, mockHealthMetrics);
    const success = await saveDailyReportSnapshot(report);
    assert.strictEqual(success, true);

    const dates = await getArchivedReportDates();
    assert.ok(dates.includes('2026-09-15'));

    const archivedReport = await getArchivedDailyReport('2026-09-15');
    assert.ok(archivedReport);
    assert.strictEqual(archivedReport?.date, '2026-09-15');
    assert.strictEqual(archivedReport?.summary.totalScheduledMinutes, 225);
  });

  await t.test('sorts archived report dates in descending chronological order', async () => {
    const report1 = generateDailyReport('2026-09-10', mockBlocks, mockHealthMetrics);
    const report2 = generateDailyReport('2026-09-20', mockBlocks, mockHealthMetrics);
    await saveDailyReportSnapshot(report1);
    await saveDailyReportSnapshot(report2);

    const dates = await getArchivedReportDates();
    const idx20 = dates.indexOf('2026-09-20');
    const idx15 = dates.indexOf('2026-09-15');
    const idx10 = dates.indexOf('2026-09-10');

    assert.ok(idx20 < idx15, '2026-09-20 should come before 2026-09-15');
    assert.ok(idx15 < idx10, '2026-09-15 should come before 2026-09-10');
  });

  await t.test('deletes archived report and removes from index', async () => {
    const success = await deleteArchivedReport('2026-09-10');
    assert.strictEqual(success, true);

    const dates = await getArchivedReportDates();
    assert.strictEqual(dates.includes('2026-09-10'), false);

    const report = await getArchivedDailyReport('2026-09-10');
    assert.strictEqual(report, null);
  });
});
