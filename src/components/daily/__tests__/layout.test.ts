import test from 'node:test';
import assert from 'node:assert';
import { layoutZeroDurationItems, getLeaderLinePath } from '../utils/layout';
import { ScheduleBlock } from '../types';

const mockHabit = (id: string, startTime: string, title: string): ScheduleBlock => ({
  id,
  title,
  type: 'zero_duration',
  sessionType: 'habit_checkpoint',
  startTime,
  durationMinutes: 0,
  endTime: startTime,
  status: 'pending',
});

test('Layout Utilities - layoutZeroDurationItems', async (t) => {
  await t.test('places a single item at its exact anchor point without displacement', () => {
    const items = [mockHabit('1', '08:00', 'Take Vitamins')];
    const positioned = layoutZeroDurationItems(items, 64, 40);

    assert.strictEqual(positioned.length, 1);
    const expectedAnchor = (480 / 60) * 64; // 8h * 64px = 512px
    assert.strictEqual(positioned[0].anchorY, expectedAnchor);
    assert.strictEqual(positioned[0].renderedY, expectedAnchor);
    assert.strictEqual(positioned[0].isDisplaced, false);
  });

  await t.test('sorts items chronologically regardless of input order', () => {
    const items = [
      mockHabit('2', '14:00', 'Afternoon Break'),
      mockHabit('1', '08:00', 'Morning Vitamins'),
    ];
    const positioned = layoutZeroDurationItems(items, 64, 40);

    assert.strictEqual(positioned[0].block.id, '1');
    assert.strictEqual(positioned[1].block.id, '2');
  });

  await t.test('displaces subsequent colliding items at the same timestamp', () => {
    const items = [
      mockHabit('1', '13:00', 'Hydration Check'),
      mockHabit('2', '13:00', 'Afternoon Meds'),
    ];
    const hourHeight = 64;
    const cardHeight = 40;
    const positioned = layoutZeroDurationItems(items, hourHeight, cardHeight);

    const anchor = (780 / 60) * hourHeight; // 13h * 64px = 832px
    assert.strictEqual(positioned[0].anchorY, anchor);
    assert.strictEqual(positioned[0].renderedY, anchor);
    assert.strictEqual(positioned[0].isDisplaced, false);

    assert.strictEqual(positioned[1].anchorY, anchor);
    assert.strictEqual(positioned[1].renderedY, anchor + cardHeight);
    assert.strictEqual(positioned[1].isDisplaced, true);
  });

  await t.test('handles cascade displacement across multiple items close in time', () => {
    const items = [
      mockHabit('1', '13:00', 'Item 1'), // 832px
      mockHabit('2', '13:00', 'Item 2'), // should be 832 + 40 = 872px
      mockHabit('3', '13:15', 'Item 3'), // anchor is 848px, but bottom is 872px, so pushed to 872 + 40 = 912px
    ];
    const positioned = layoutZeroDurationItems(items, 64, 40);

    assert.strictEqual(positioned[0].renderedY, 832);
    assert.strictEqual(positioned[0].isDisplaced, false);

    assert.strictEqual(positioned[1].renderedY, 872);
    assert.strictEqual(positioned[1].isDisplaced, true);

    assert.strictEqual(positioned[2].renderedY, 912);
    assert.strictEqual(positioned[2].isDisplaced, true);
  });
});

test('Layout Utilities - getLeaderLinePath', () => {
  const path = getLeaderLinePath(100, 140, 32, 0, 32);
  // Target Y should be 140 + 32/2 = 156
  assert.ok(path.startsWith('M 0 100'));
  assert.ok(path.includes('156'));
});
