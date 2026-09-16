import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { DailyTabMode } from './types';
import { DailyHamburgerMenu } from './DailyHamburgerMenu';
import { DailyScheduleScreen } from './DailyScheduleScreen';
import { DailyHealthScreen } from './DailyHealthScreen';
import { DailyPastReportsScreen } from './DailyPastReportsScreen';
import { DailyReportModal } from './DailyReportModal';
import { ResetConfirmModal } from './ResetConfirmModal';
import { StartNewDayConfirmModal } from './StartNewDayConfirmModal';
import { useScheduleStore } from './stores/useScheduleStore';
import { useHealthMetricsStore } from './stores/useHealthMetricsStore';
import { generateDailyReport, saveDailyReportSnapshot } from './utils/report';
import { getNextDayDateString } from './utils/time';

export function DailyScreen() {
  const [activeTab, setActiveTab] = useState<DailyTabMode>('schedule');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isNewDayModalOpen, setIsNewDayModalOpen] = useState(false);

  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const blocks = useScheduleStore((state) => state.blocks);
  const resetSchedule = useScheduleStore((state) => state.resetSchedule);
  const startNewDaySchedule = useScheduleStore((state) => state.startNewDaySchedule);

  const metrics = useHealthMetricsStore((state) => state.metrics);
  const resetMetrics = useHealthMetricsStore((state) => state.resetMetrics);
  const startNewDayMetrics = useHealthMetricsStore((state) => state.startNewDayMetrics);

  const nextDate = React.useMemo(() => getNextDayDateString(selectedDate), [selectedDate]);

  const handleConfirmReset = async () => {
    await resetSchedule();
    await resetMetrics();
  };

  const handleConfirmStartNewDay = async () => {
    // 1. Generate full summary payload for today
    const reportPayload = generateDailyReport(selectedDate, blocks, metrics);

    // 2. Store the day's JSON data snapshot into client archive storage
    await saveDailyReportSnapshot(reportPayload);

    // 3. Roll over schedule & health vitals to next day
    await startNewDaySchedule(nextDate);
    await startNewDayMetrics(nextDate);
  };

  // Format date display
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(selectedDate + 'T12:00:00');
      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase();
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeftRow}>
            <DailyHamburgerMenu
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              currentRoute="daily"
            />
            <ThemedText type="subtitle" style={styles.titleText}>
              {formattedDate}
            </ThemedText>
          </View>

          {/* Action Button Group */}
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setIsReportOpen(true)}
              style={({ pressed }) => [
                styles.reportButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Generate daily report"
            >
              <ThemedText type="smallBold" style={styles.reportButtonText}>
                📊 Generate Report
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setIsResetModalOpen(true)}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Reset today's data"
            >
              <ThemedText type="smallBold" themeColor="textSecondary">
                ↺ Reset
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setIsNewDayModalOpen(true)}
              style={({ pressed }) => [
                styles.newDayButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Start new day"
            >
              <ThemedText type="smallBold" style={styles.newDayButtonText}>
                🌅 Start New Day
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Tab Content View */}
        <View style={styles.contentView}>
          {activeTab === 'schedule' ? (
            <DailyScheduleScreen onOpenReport={() => setIsReportOpen(true)} />
          ) : activeTab === 'vitals' ? (
            <DailyHealthScreen />
          ) : (
            <DailyPastReportsScreen />
          )}
        </View>

        {/* Daily Report Modal */}
        <DailyReportModal
          visible={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />

        {/* Reset Confirmation Modal */}
        <ResetConfirmModal
          visible={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleConfirmReset}
        />

        {/* Start New Day Confirmation Modal */}
        <StartNewDayConfirmModal
          visible={isNewDayModalOpen}
          currentDate={selectedDate}
          nextDate={nextDate}
          onClose={() => setIsNewDayModalOpen(false)}
          onConfirm={handleConfirmStartNewDay}
          completedTasksCount={blocks.filter((b) => b.status === 'completed').length}
          totalTasksCount={blocks.length}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 4,
  },
  titleText: {
    fontSize: 18,
    lineHeight: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  reportButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.one + 4,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 13,
  },
  resetButton: {
    paddingVertical: Spacing.one + 3,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#33333330',
  },
  newDayButton: {
    backgroundColor: '#10B981',
    paddingVertical: Spacing.one + 4,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  newDayButtonText: {
    color: '#ffffff',
    fontSize: 13,
  },
  contentView: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
