import React from 'react';
import { StyleSheet, View } from 'react-native';

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
  const targetY = renderedY + cardHeight / 2;
  const deltaY = targetY - anchorY;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: -width,
          top: anchorY,
          width,
          height: Math.max(deltaY, 1),
        },
      ]}
    >
      {/* Horizontal stub from ruler */}
      <View style={[styles.horizontalLine, { width: 12, top: 0, left: 0 }]} />
      {/* Diagonal/vertical connecting segment */}
      <View
        style={[
          styles.verticalLine,
          {
            left: 12,
            top: 0,
            height: deltaY,
          },
        ]}
      />
      {/* Horizontal stub into card */}
      <View
        style={[
          styles.horizontalLine,
          {
            width: width - 12,
            left: 12,
            top: deltaY,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 5,
  },
  horizontalLine: {
    position: 'absolute',
    height: 1.5,
    borderBottomWidth: 1.5,
    borderBottomColor: '#94A3B8',
    borderStyle: 'dashed',
  },
  verticalLine: {
    position: 'absolute',
    width: 1.5,
    borderLeftWidth: 1.5,
    borderLeftColor: '#94A3B8',
    borderStyle: 'dashed',
  },
});
