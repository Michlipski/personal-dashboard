import test from 'node:test';
import assert from 'node:assert';
import {
  calculateWaterMetrics,
  getWaterFillPercentage,
  WATER_GRADIENT_CSS,
  WATER_GRADIENT_STOPS,
} from '../utils/water';

test('Water Utilities - calculateWaterMetrics', async (t) => {
  await t.test('computes milliliters and percentage with default 12 glasses / 3000ml target', () => {
    const r1 = calculateWaterMetrics(0);
    assert.strictEqual(r1.glasses, 0);
    assert.strictEqual(r1.targetGlasses, 12);
    assert.strictEqual(r1.milliliters, 0);
    assert.strictEqual(r1.percentageOfTarget, 0);

    const r2 = calculateWaterMetrics(9); // 9 of 12 glasses = 2250ml of 3000ml (75%)
    assert.strictEqual(r2.glasses, 9);
    assert.strictEqual(r2.targetGlasses, 12);
    assert.strictEqual(r2.milliliters, 2250);
    assert.strictEqual(r2.percentageOfTarget, 0.75);

    const r3 = calculateWaterMetrics(12); // 12 of 12 glasses = 3000ml (100%)
    assert.strictEqual(r3.glasses, 12);
    assert.strictEqual(r3.targetGlasses, 12);
    assert.strictEqual(r3.milliliters, 3000);
    assert.strictEqual(r3.percentageOfTarget, 1);
  });

  await t.test('computes milliliters and percentage accurately with custom target', () => {
    const r = calculateWaterMetrics(6, 8);
    assert.strictEqual(r.glasses, 6);
    assert.strictEqual(r.milliliters, 1500);
    assert.strictEqual(r.percentageOfTarget, 0.75);
  });

  await t.test('handles overflow past target', () => {
    const r = calculateWaterMetrics(14, 12); // 14 glasses = 3500ml
    assert.strictEqual(r.glasses, 14);
    assert.strictEqual(r.milliliters, 3500);
    assert.strictEqual(r.percentageOfTarget, 1.17);
  });

  await t.test('handles negative glasses gracefully', () => {
    const r = calculateWaterMetrics(-2);
    assert.strictEqual(r.glasses, 0);
    assert.strictEqual(r.milliliters, 0);
    assert.strictEqual(r.percentageOfTarget, 0);
  });
});

test('Water Utilities - getWaterFillPercentage', () => {
  assert.strictEqual(getWaterFillPercentage(0, 12), 0);
  assert.strictEqual(getWaterFillPercentage(6, 12), 0.5);
  assert.strictEqual(getWaterFillPercentage(12, 12), 1);
  // Clamped at 1
  assert.strictEqual(getWaterFillPercentage(16, 12), 1);
  // Clamped at 0
  assert.strictEqual(getWaterFillPercentage(-5, 12), 0);
});

test('Water Utilities - WATER_GRADIENT_STOPS definition', () => {
  assert.strictEqual(WATER_GRADIENT_STOPS.length, 6);
  assert.strictEqual(WATER_GRADIENT_STOPS[0].color, '#EF4444');
  assert.strictEqual(WATER_GRADIENT_STOPS[5].color, '#4F46E5');
});

test('Water Utilities - WATER_GRADIENT_CSS linear gradient string', () => {
  assert.ok(WATER_GRADIENT_CSS.startsWith('linear-gradient(90deg,'));
  assert.ok(WATER_GRADIENT_CSS.includes('#EF4444 0%'));
  assert.ok(WATER_GRADIENT_CSS.includes('#4F46E5 100%'));
});
