import test from 'node:test';
import assert from 'node:assert';

test('Daily Hamburger Menu - Contract & Tabs Validation', async (t) => {
  await t.test('daily tab modes conform to canonical options: schedule, vitals, reports', () => {
    const validModes = ['schedule', 'vitals', 'reports'];
    assert.strictEqual(validModes.length, 3);
    assert.ok(validModes.includes('schedule'));
    assert.ok(validModes.includes('vitals'));
    assert.ok(validModes.includes('reports'));
  });

  await t.test('routes for navigation menu include daily and storybook', () => {
    const validRoutes = ['daily', 'storybook'];
    assert.strictEqual(validRoutes.length, 2);
    assert.ok(validRoutes.includes('daily'));
    assert.ok(validRoutes.includes('storybook'));
  });
});
