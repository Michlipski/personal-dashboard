import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { PositionedZeroDurationItem, ScheduleBlock } from './types';
import { TriStateCheckbox } from './TriStateCheckbox';
import { LeaderLineSvg } from './LeaderLineSvg';

export interface RightLaneZeroDurationBlockProps {
  item: PositionedZeroDurationItem;
  onPress: (block: ScheduleBlock) => void;
  onToggleStatus: (id: string) => void;
}

const CARD_HEIGHT = 34;

export function RightLaneZeroDurationBlock({
  item,
  onPress,
  onToggleStatus,
}: RightLaneZeroDurationBlockProps) {
  const { block, anchorY, renderedY, isDisplaced } = item;
  const isDone = block.status === 'completed';
  const isMissed = block.status === 'missed';

  return (
    <>
      {isDisplaced && (
        <LeaderLineSvg
          anchorY={anchorY}
          renderedY={renderedY}
          cardHeight={CARD_HEIGHT}
          width={28}
        />
      )}

      <Pressable
        onPress={() => onPress(block)}
        style={({ pressed }) => [
          styles.container,
          {
            top: renderedY,
            height: CARD_HEIGHT,
          },
          (isDone || isMissed) && styles.dimmed,
          pressed && styles.pressed,
        ]}
      >
        <ThemedView type="backgroundElement" style={styles.cardContent}>
          <TriStateCheckbox
            status={block.status}
            onToggle={() => onToggleStatus(block.id)}
            size={18}
          />
          <ThemedText
            numberOfLines={1}
            type="small"
            style={[
              styles.title,
              isDone && styles.completedTitle,
              isMissed && styles.missedTitle,
            ]}
          >
            {block.title}
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.timeTag}>
            {block.startTime}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.one,
    right: Spacing.one,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    zIndex: 15,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    gap: Spacing.one + 2,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981', // Habit green
  },
  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  missedTitle: {
    textDecorationLine: 'line-through',
    color: '#EF4444',
    opacity: 0.7,
  },
  timeTag: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  dimmed: {
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.85,
  },
});
