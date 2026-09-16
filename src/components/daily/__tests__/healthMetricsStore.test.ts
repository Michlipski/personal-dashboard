import test from 'node:test';
import assert from 'node:assert';
import {
  useHealthMetricsStore,
  DEFAULT_HEALTH_METRICS,
} from '../stores/useHealthMetricsStore';

test('Health Metrics Store - Unset Defaults & Clean Initialization', async (t) => {
  await t.test('DEFAULT_HEALTH_METRICS has clean unset values', () => {
    assert.strictEqual(DEFAULT_HEALTH_METRICS.waterIntake.glasses, 0);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.waterIntake.milliliters, 0);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.waterIntake.percentageOfTarget, 0);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.energyLevel, undefined);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.mood, undefined);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.moodNotes, '');
    assert.strictEqual(DEFAULT_HEALTH_METRICS.screenTime.totalMinutes, 0);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.screenTime.productiveMinutes, 0);
    assert.strictEqual(DEFAULT_HEALTH_METRICS.screenTime.leisureMinutes, 0);
  });

  await t.test('resetMetrics restores store to unset defaults', async () => {
    // Modify metrics
    await useHealthMetricsStore.getState().addWaterGlass();
    await useHealthMetricsStore.getState().setEnergyLevel('high');
    await useHealthMetricsStore.getState().setMood('great', 'Feeling energetic');
    await useHealthMetricsStore.getState().setScreenTime(120, 90, 30);

    const modified = useHealthMetricsStore.getState().metrics;
    assert.strictEqual(modified.waterIntake.glasses, 1);
    assert.strictEqual(modified.energyLevel, 'high');
    assert.strictEqual(modified.mood, 'great');
    assert.strictEqual(modified.moodNotes, 'Feeling energetic');
    assert.strictEqual(modified.screenTime.totalMinutes, 120);

    // Reset
    await useHealthMetricsStore.getState().resetMetrics();
    const resetState = useHealthMetricsStore.getState().metrics;

    assert.strictEqual(resetState.waterIntake.glasses, 0);
    assert.strictEqual(resetState.waterIntake.milliliters, 0);
    assert.strictEqual(resetState.waterIntake.percentageOfTarget, 0);
    assert.strictEqual(resetState.energyLevel, undefined);
    assert.strictEqual(resetState.mood, undefined);
    assert.strictEqual(resetState.moodNotes, '');
    assert.strictEqual(resetState.screenTime.totalMinutes, 0);
    assert.strictEqual(resetState.screenTime.productiveMinutes, 0);
    assert.strictEqual(resetState.screenTime.leisureMinutes, 0);
  });
});
