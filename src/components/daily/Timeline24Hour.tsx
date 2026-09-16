import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ScheduleBlock } from './types';
import { LeftLaneDurationBlock } from './LeftLaneDurationBlock';
import { RightLaneZeroDurationBlock } from './RightLaneZeroDurationBlock';
import { layoutZeroDurationItems } from './utils/layout';
import { TIMELINE_HOUR_HEIGHT } from './constants';

export interface Timeline24HourProps {
  blocks: ScheduleBlock[];
  onPressBlock: (block: ScheduleBlock) => void;
  onToggleStatus: (id: string) => void;
  hourHeight?: number;
}

const HOURS_IN_DAY = Array.from({ length: 24 }, (_, i) => i);

export function Timeline24Hour({
  blocks,
  onPressBlock,
  onToggleStatus,
  hourHeight = TIMELINE_HOUR_HEIGHT,
}: Timeline24HourProps) {
  const theme = useTheme();

  const durationBlocks = useMemo(
    () => blocks.filter((b) => b.type !== 'zero_duration'),
    [blocks]
  );

  const zeroDurationBlocks = useMemo(
    () => blocks.filter((b) => b.type === 'zero_duration'),
    [blocks]
  );

  const positionedZeroDurationItems = useMemo(
    () => layoutZeroDurationItems(zeroDurationBlocks, hourHeight, 40),
    [zeroDurationBlocks, hourHeight]
  );

  const totalHeight = 24 * hourHeight;

  return (
    <ThemedView style={styles.outerContainer}>
      {/* Timeline Column Headers */}
      <View style={styles.columnHeaderRow}>
        <View style={styles.rulerHeaderSpacer} />
        <ThemedView type="backgroundElement" style={styles.laneHeaderLeft}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Duration Blocks (&gt;0m)
          </ThemedText>
        </ThemedView>
        <ThemedView type="backgroundElement" style={styles.laneHeaderRight}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Habit Checkpoints (0m)
          </ThemedText>
        </ThemedView>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.contentContainer, { height: totalHeight + 40 }]}
        showsVerticalScrollIndicator={true}
      >
        {/* Background Hourly Grid Lines and Ticks */}
        {HOURS_IN_DAY.map((hour) => {
          const top = hour * hourHeight;
          const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
          return (
            <View key={hour} style={[styles.gridRow, { top, height: hourHeight }]}>
              <View style={styles.rulerTickContainer}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.timeLabel}>
                  {timeLabel}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.gridLine,
                  { borderBottomColor: theme.backgroundElement },
                ]}
              />
            </View>
          );
        })}

        {/* Lanes Container */}
        <View style={[styles.lanesWrapper, { height: totalHeight }]}>
          {/* Left Lane: 50% width */}
          <View style={styles.leftLane}>
            {durationBlocks.map((block) => (
              <LeftLaneDurationBlock
                key={block.id}
                block={block}
                hourHeight={hourHeight}
                onPress={onPressBlock}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </View>

          {/* Lane Divider */}
          <View style={[styles.centerDivider, { backgroundColor: theme.backgroundElement }]} />

          {/* Right Lane: 50% width */}
          <View style={styles.rightLane}>
            {positionedZeroDurationItems.map((item) => (
              <RightLaneZeroDurationBlock
                key={item.block.id}
                item={item}
                onPress={onPressBlock}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  columnHeaderRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#33333330',
  },
  rulerHeaderSpacer: {
    width: 48,
  },
  laneHeaderLeft: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 4,
    alignItems: 'center',
  },
  laneHeaderRight: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 4,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    position: 'relative',
    paddingTop: 10,
  },
  gridRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rulerTickContainer: {
    width: 48,
    alignItems: 'center',
    paddingTop: 0,
  },
  timeLabel: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    marginTop: -8,
  },
  gridLine: {
    flex: 1,
    borderBottomWidth: 1,
    marginTop: 0,
  },
  lanesWrapper: {
    position: 'absolute',
    left: 48,
    right: 0,
    top: 10,
    flexDirection: 'row',
  },
  leftLane: {
    flex: 1,
    position: 'relative',
    marginRight: 2,
  },
  centerDivider: {
    width: 1,
    height: '100%',
  },
  rightLane: {
    flex: 1,
    position: 'relative',
    marginLeft: 2,
  },
});
