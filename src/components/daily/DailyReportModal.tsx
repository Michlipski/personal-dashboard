import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useScheduleStore } from './stores/useScheduleStore';
import { useHealthMetricsStore } from './stores/useHealthMetricsStore';
import { generateDailyReport } from './utils/report';
import { JsonSyntaxViewer } from './JsonSyntaxViewer';
import { CopyReportButton } from './CopyReportButton';
import { formatMinutesToHoursDisplay } from './utils/time';

export interface DailyReportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DailyReportModal({ visible, onClose }: DailyReportModalProps) {
  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const blocks = useScheduleStore((state) => state.blocks);
  const healthMetrics = useHealthMetricsStore((state) => state.metrics);

  const reportPayload = useMemo(() => {
    return generateDailyReport(selectedDate, blocks, healthMetrics);
  }, [selectedDate, blocks, healthMetrics]);

  const jsonFormatted = useMemo(() => {
    return JSON.stringify(reportPayload, null, 2);
  }, [reportPayload]);

  const { summary, healthVitals } = reportPayload;
  const completionPercent = Math.round(summary.completionRate * 100);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ThemedView type="backgroundElement" style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <ThemedText type="smallBold" style={styles.tagline}>
                STAGE 1 SYNTHESIS
              </ThemedText>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Daily Report: {selectedDate}
              </ThemedText>
            </View>

            <Pressable onPress={onClose} style={styles.closeIconBtn}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                ✕
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Executive Summary Cards */}
            <ThemedView type="background" style={styles.summaryCard}>
              <ThemedText type="smallBold" style={styles.summaryTitle}>
                📊 EXECUTION SUMMARY
              </ThemedText>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Scheduled Time
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {formatMinutesToHoursDisplay(summary.totalScheduledMinutes)}
                  </ThemedText>
                </View>

                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Completed Focus
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: '#10B981' }}>
                    {formatMinutesToHoursDisplay(summary.completedMinutes)}
                  </ThemedText>
                </View>

                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Completion Rate
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {completionPercent}%
                  </ThemedText>
                </View>

                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Habit Checkpoints
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {summary.zeroDurationItemsCompleted} / {summary.zeroDurationItemsTotal}
                  </ThemedText>
                </View>

                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Water Intake
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {healthVitals.waterIntake.milliliters} / {healthVitals.waterIntake.targetGlasses * 250} ml (
                    {Math.round(healthVitals.waterIntake.percentageOfTarget * 100)}%)
                  </ThemedText>
                </View>

                <View style={styles.statBox}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Energy & Mood
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {(healthVitals.energyLevel?.toUpperCase() ?? '—')} • {(healthVitals.mood?.toUpperCase() ?? '—')}
                  </ThemedText>
                </View>
              </View>
            </ThemedView>

            {/* JSON Payload Viewer */}
            <View style={styles.jsonSection}>
              <ThemedText type="smallBold">CANONICAL JSON PAYLOAD (SCHEMA v1.0)</ThemedText>
              <JsonSyntaxViewer jsonString={jsonFormatted} maxHeight={260} />
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <CopyReportButton payload={reportPayload} />

            <Pressable onPress={onClose} style={styles.closeBtn}>
              <ThemedText type="small" themeColor="textSecondary">
                Close
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  modalCard: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '92%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagline: {
    letterSpacing: 1,
    fontSize: 10,
    color: '#3B82F6',
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  closeIconBtn: {
    padding: 6,
  },
  scrollBody: {
    maxHeight: 520,
  },
  summaryCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  summaryTitle: {
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statBox: {
    width: '47%',
    padding: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#33333315',
    gap: 2,
  },
  jsonSection: {
    gap: Spacing.one + 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#33333330',
  },
  closeBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
