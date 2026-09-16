import { ScheduleBlock, PositionedZeroDurationItem } from '../types';
import { TIMELINE_HOUR_HEIGHT, ZERO_DURATION_CARD_HEIGHT } from '../constants';
import { timeStringToMinutes } from './time';

/**
 * Calculates collision-free positions for zero-duration checklist items in the right lane
 */
export function layoutZeroDurationItems(
  items: ScheduleBlock[],
  hourHeight: number = TIMELINE_HOUR_HEIGHT,
  cardHeight: number = ZERO_DURATION_CARD_HEIGHT
): PositionedZeroDurationItem[] {
  // Sort items chronologically by startTime
  const sorted = [...items].sort((a, b) =>
    timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );

  let lastOccupiedBottom = -Infinity;
  const result: PositionedZeroDurationItem[] = [];

  for (const block of sorted) {
    const startMin = timeStringToMinutes(block.startTime);
    const anchorY = (startMin / 60) * hourHeight;

    // Position at anchorY or push down to lastOccupiedBottom if colliding
    const renderedY = Math.max(anchorY, lastOccupiedBottom);
    lastOccupiedBottom = renderedY + cardHeight;

    result.push({
      block,
      anchorY,
      renderedY,
      isDisplaced: Math.abs(renderedY - anchorY) > 2,
    });
  }

  return result;
}

/**
 * Returns SVG path data for a connecting leader line from time ruler (x0, anchorY)
 * to displaced card (x1, renderedY + cardHeight/2)
 */
export function getLeaderLinePath(
  anchorY: number,
  renderedY: number,
  cardHeight: number = 32,
  startX: number = 0,
  endX: number = 32
): string {
  const targetY = renderedY + cardHeight / 2;
  const midX1 = startX + 12;
  const midX2 = endX - 8;
  return `M ${startX} ${anchorY} L ${midX1} ${anchorY} L ${midX2} ${targetY} L ${endX} ${targetY}`;
}
