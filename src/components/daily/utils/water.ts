import {
  DEFAULT_WATER_TARGET_GLASSES,
  ML_PER_GLASS,
  WATER_GRADIENT_CSS,
  WATER_GRADIENT_STOPS,
} from '../constants';

export { WATER_GRADIENT_CSS, WATER_GRADIENT_STOPS };

export interface WaterMetricsCalculation {
  glasses: number;
  targetGlasses: number;
  milliliters: number;
  percentageOfTarget: number;
}

export function calculateWaterMetrics(
  glasses: number,
  targetGlasses: number = DEFAULT_WATER_TARGET_GLASSES
): WaterMetricsCalculation {
  const safeGlasses = Math.max(0, Math.floor(glasses));
  const safeTarget = Math.max(1, Math.floor(targetGlasses));
  const milliliters = safeGlasses * ML_PER_GLASS;
  const percentageOfTarget = Math.round((safeGlasses / safeTarget) * 100) / 100;

  return {
    glasses: safeGlasses,
    targetGlasses: safeTarget,
    milliliters,
    percentageOfTarget,
  };
}

export function getWaterFillPercentage(
  glasses: number,
  targetGlasses: number = DEFAULT_WATER_TARGET_GLASSES
): number {
  const safeGlasses = Math.max(0, glasses);
  const safeTarget = Math.max(1, targetGlasses);
  return Math.min(Math.max(safeGlasses / safeTarget, 0), 1);
}
