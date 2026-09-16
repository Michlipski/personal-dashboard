import React from 'react';
import { getLeaderLinePath } from './utils/layout';

export interface LeaderLineSvgProps {
  anchorY: number;
  renderedY: number;
  cardHeight?: number;
  width?: number;
}

export function LeaderLineSvg({
  anchorY,
  renderedY,
  cardHeight = 32,
  width = 36,
}: LeaderLineSvgProps) {
  const minY = Math.min(anchorY, renderedY);
  const maxY = Math.max(anchorY, renderedY + cardHeight / 2);
  const height = Math.max(maxY - minY + 4, 10);
  const offsetY = minY - 2;

  // Local coordinates relative to SVG container
  const localAnchorY = anchorY - offsetY;
  const localRenderedY = renderedY - offsetY;
  const pathD = getLeaderLinePath(localAnchorY, localRenderedY, cardHeight, 2, width - 2);

  return (
    <div
      style={{
        position: 'absolute',
        left: -width,
        top: offsetY,
        width,
        height,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <path
          d={pathD}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
      </svg>
    </div>
  );
}
