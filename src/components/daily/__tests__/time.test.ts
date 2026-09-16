import test from 'node:test';
import assert from 'node:assert';
import {
  timeStringToMinutes,
  minutesToTimeString,
  recalculateTime,
  getNextQuarterHour,
  formatMinutesToHoursDisplay,
  getNextDayDateString,
} from '../utils/time';

test('Time Utilities - timeStringToMinutes', async (t) => {
  await t.test('converts valid time strings to total minutes from midnight', () => {
    assert.strictEqual(timeStringToMinutes('00:00'), 0);
    assert.strictEqual(timeStringToMinutes('01:30'), 90);
    assert.strictEqual(timeStringToMinutes('13:30'), 810);
    assert.strictEqual(timeStringToMinutes('23:59'), 1439);
  });

  await t.test('handles whitespace and edge cases gracefully', () => {
    assert.strictEqual(timeStringToMinutes(' 08:15 '), 495);
    assert.strictEqual(timeStringToMinutes(''), 0);
    assert.strictEqual(timeStringToMinutes('invalid'), 0);
  });
});

test('Time Utilities - minutesToTimeString', async (t) => {
  await t.test('converts minute numbers to formatted 24-hour HH:mm string', () => {
    assert.strictEqual(minutesToTimeString(0), '00:00');
    assert.strictEqual(minutesToTimeString(90), '01:30');
    assert.strictEqual(minutesToTimeString(810), '13:30');
    assert.strictEqual(minutesToTimeString(1439), '23:59');
  });

  await t.test('wraps around 24-hour boundary (> 1440 mins)', () => {
    assert.strictEqual(minutesToTimeString(1440), '00:00');
    assert.strictEqual(minutesToTimeString(1500), '01:00');
  });
});

test('Time Utilities - recalculateTime bidirectional engine', async (t) => {
  await t.test('Case 1: User edits startTime -> recalculates endTime preserving duration', () => {
    const current = { startTime: '09:00', durationMinutes: 60, endTime: '10:00' };
    const result = recalculateTime('startTime', {
      ...current,
      startTime: '10:30',
    });
    assert.strictEqual(result.startTime, '10:30');
    assert.strictEqual(result.durationMinutes, 60);
    assert.strictEqual(result.endTime, '11:30');
  });

  await t.test('Case 2: User edits duration -> recalculates endTime preserving startTime', () => {
    const current = { startTime: '13:30', durationMinutes: 45, endTime: '14:15' };
    const result = recalculateTime('duration', {
      ...current,
      durationMinutes: 90,
    });
    assert.strictEqual(result.startTime, '13:30');
    assert.strictEqual(result.durationMinutes, 90);
    assert.strictEqual(result.endTime, '15:00');
  });

  await t.test('Case 3: User edits endTime -> recalculates duration preserving startTime', () => {
    const current = { startTime: '14:00', durationMinutes: 60, endTime: '15:00' };
    const result = recalculateTime('endTime', {
      ...current,
      endTime: '16:30',
    });
    assert.strictEqual(result.startTime, '14:00');
    assert.strictEqual(result.durationMinutes, 150);
    assert.strictEqual(result.endTime, '16:30');
  });

  await t.test('Case 4: Overnight wrapping when endTime crosses midnight', () => {
    const current = { startTime: '23:00', durationMinutes: 60, endTime: '00:00' };
    const result = recalculateTime('endTime', {
      ...current,
      endTime: '01:00',
    });
    assert.strictEqual(result.startTime, '23:00');
    assert.strictEqual(result.durationMinutes, 120); // 2 hours across midnight
    assert.strictEqual(result.endTime, '01:00');
  });
});

test('Time Utilities - getNextQuarterHour', () => {
  const d1 = new Date('2026-09-09T13:07:00');
  assert.strictEqual(getNextQuarterHour(d1), '13:15');

  const d2 = new Date('2026-09-09T13:15:00');
  assert.strictEqual(getNextQuarterHour(d2), '13:30');

  const d3 = new Date('2026-09-09T13:46:00');
  assert.strictEqual(getNextQuarterHour(d3), '14:00');
});

test('Time Utilities - formatMinutesToHoursDisplay', () => {
  assert.strictEqual(formatMinutesToHoursDisplay(45), '45m');
  assert.strictEqual(formatMinutesToHoursDisplay(120), '2h');
  assert.strictEqual(formatMinutesToHoursDisplay(135), '2h 15m');
  assert.strictEqual(formatMinutesToHoursDisplay(0), '0m');
});

test('Time Utilities - getNextDayDateString', async (t) => {
  await t.test('advances standard day by 1', () => {
    assert.strictEqual(getNextDayDateString('2026-09-13'), '2026-09-14');
  });

  await t.test('advances across month boundary', () => {
    assert.strictEqual(getNextDayDateString('2026-09-30'), '2026-10-01');
  });

  await t.test('advances across year boundary', () => {
    assert.strictEqual(getNextDayDateString('2026-12-31'), '2027-01-01');
  });

  await t.test('handles leap year correctly', () => {
    assert.strictEqual(getNextDayDateString('2024-02-28'), '2024-02-29');
    assert.strictEqual(getNextDayDateString('2024-02-29'), '2024-03-01');
  });
});
