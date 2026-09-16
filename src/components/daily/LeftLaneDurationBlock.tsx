import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ScheduleBlock } from './types';
import { TriStateCheckbox } from './TriStateCheckbox';
import { timeStringToMinutes } from './utils/time';
import { SESSION_TYPE_COLORS, SESSION_TYPE_LABELS, TIMELINE_HOUR_HEIGHT } from './constants';

export interface LeftLaneDurationBlockProps {
  block: ScheduleBlock;
  hourHeight?: number;
  onPress: (block: ScheduleBlock) => void;
  onToggleStatus: (id: string) => void;
}

export function LeftLaneDurationBlock({
  block,
  hourHeight = TIMELINE_HOUR_HEIGHT,
  onPress,
  onToggleStatus,
}: LeftLaneDurationBlockProps) {
  const startMin = timeStringToMinutes(block.startTime);
  const top = (startMin / 60) * hourHeight;
  const rawHeight = (block.durationMinutes / 60) * hourHeight;
  const height = Math.max(rawHeight, 38);

  const categoryColor = SESSION_TYPE_COLORS[block.sessionType] || '#3B82F6';
  const categoryLabel = SESSION_TYPE_LABELS[block.sessionType] || block.sessionType;

  const isDone = block.status === 'completed';
  const isMissed = block.status === 'missed';

  return (
    <Pressable
      onPress={() => onPress(block)}
      style={({ pressed }) => [
        styles.container,
        {
          top,
          height,
          borderLeftColor: categoryColor,
        },
        (isDone || isMissed) && styles.dimmed,
        pressed && styles.pressed,
      ]}
    >
      <ThemedView type="backgroundElement" style={styles.cardContent}>
        <View style={styles.headerRow}>
          <TriStateCheckbox
            status={block.status}
            onToggle={() => onToggleStatus(block.id)}
            size={20}
          />
          <ThemedText
            numberOfLines={height > 50 ? 2 : 1}
            type="smallBold"
            style={[
              styles.title,
              isDone && styles.completedTitle,
              isMissed && styles.missedTitle,
            ]}
          >
            {block.title}
          </ThemedText>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: categoryColor + '20' }]}>
            <ThemedText style={[styles.badgeText, { color: categoryColor }]}>
              {categoryLabel}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.timeText}>
            {block.startTime} - {block.endTime} ({block.durationMinutes}m)
          </ThemedText>
        </View>

        {height >= 80 && !!block.notes && (
          <ThemedText
            numberOfLines={2}
            type="small"
            themeColor="textSecondary"
            style={styles.notesText}
          >
            {block.notes}
          </ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.one,
    right: Spacing.one,
    borderLeftWidth: 4,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    zIndex: 10,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 2,
    justifyContent: 'flex-start',
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    lineHeight: 14,
  },
  notesText: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  dimmed: {
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.85,
  },
});
