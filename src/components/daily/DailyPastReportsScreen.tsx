import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { DailyReportPayload } from './types';
import {
  getArchivedReportDates,
  getArchivedDailyReport,
  deleteArchivedReport,
  seedSampleArchivedReportIfEmpty,
} from './utils/report';
import { formatMinutesToHoursDisplay } from './utils/time';
import { JsonSyntaxViewer } from './JsonSyntaxViewer';
import { CopyReportButton } from './CopyReportButton';

export function DailyPastReportsScreen() {
  const [archivedDates, setArchivedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reportPayload, setReportPayload] = useState<DailyReportPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Load dates on mount
  const refreshDates = async (preferredDate?: string) => {
    setLoading(true);
    try {
      await seedSampleArchivedReportIfEmpty();
      const dates = await getArchivedReportDates();
      setArchivedDates(dates);

      const targetDate = preferredDate || (dates.length > 0 ? dates[0] : null);
      if (targetDate) {
        setSelectedDate(targetDate);
        const report = await getArchivedDailyReport(targetDate);
        setReportPayload(report);
      } else {
        setSelectedDate(null);
        setReportPayload(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDates();
  }, []);

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    const report = await getArchivedDailyReport(date);
    setReportPayload(report);
  };

  const handleDeleteReport = async (date: string) => {
    await deleteArchivedReport(date);
    await refreshDates();
  };

  // Format date display for selector chips
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const jsonFormatted = useMemo(() => {
    return reportPayload ? JSON.stringify(reportPayload, null, 2) : '';
  }, [reportPayload]);

  if (loading) {
    return (
      <ThemedView type="background" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <ThemedText type="small" themeColor="textSecondary">
          Loading report archive...
        </ThemedText>
      </ThemedView>
    );
  }

  if (archivedDates.length === 0 || !reportPayload) {
    return (
      <ScrollView contentContainerStyle={styles.emptyContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyCard}>
          <ThemedText style={styles.emptyIcon}>📜</ThemedText>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No Past Reports Yet
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.emptyDescription}>
            Daily reports are automatically archived whenever you tap "Start New Day" or generate an export snapshot.
          </ThemedText>

          <Pressable
            onPress={() => refreshDates()}
            style={({ pressed }) => [styles.seedButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Load sample report"
          >
            <ThemedText type="smallBold" style={styles.seedButtonText}>
              Load Sample Past Report
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const { summary, healthVitals } = reportPayload;
  const completionPercent = Math.round(summary.completionRate * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="smallBold" style={styles.tagline}>
            HISTORICAL ARCHIVE
          </ThemedText>
          <ThemedText type="subtitle" style={styles.titleText}>
            Past Daily Reports
          </ThemedText>
        </View>

        <View style={styles.archiveCountBadge}>
          <ThemedText type="smallBold" style={{ color: '#3B82F6' }}>
            {archivedDates.length} {archivedDates.length === 1 ? 'Report' : 'Reports'}
          </ThemedText>
        </View>
      </View>

      {/* Date Selector Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {archivedDates.map((dateStr) => {
          const isSelected = dateStr === selectedDate;
          return (
            <Pressable
              key={dateStr}
              onPress={() => handleSelectDate(dateStr)}
              style={({ pressed }) => [
                styles.dateChip,
                isSelected && styles.selectedChip,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select report for ${dateStr}`}
            >
              <ThemedText
                type="smallBold"
                style={[styles.dateChipText, isSelected && styles.selectedChipText]}
              >
                {formatDateLabel(dateStr)}
              </ThemedText>
              <ThemedText
                type="small"
                themeColor={isSelected ? 'text' : 'textSecondary'}
                style={styles.chipDateSub}
              >
                {dateStr}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Selected Report Detail Card */}
      <ThemedView type="backgroundElement" style={styles.reportCard}>
        {/* Date and Generated Header */}
        <View style={styles.reportHeader}>
          <View>
            <ThemedText type="subtitle">
              Report for {reportPayload.date}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Archived at {new Date(reportPayload.generatedAt).toLocaleString()}
            </ThemedText>
          </View>

          <Pressable
            onPress={() => handleDeleteReport(reportPayload.date)}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Delete archived report"
          >
            <ThemedText type="small" style={styles.deleteButtonText}>
              🗑️ Delete
            </ThemedText>
          </Pressable>
        </View>

        {/* Executive Summary Metrics Grid */}
        <ThemedView type="background" style={styles.summaryBox}>
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

        {/* Canonical JSON Payload View */}
        <View style={styles.jsonSection}>
          <ThemedText type="smallBold">CANONICAL JSON PAYLOAD (SCHEMA v1.0)</ThemedText>
          <JsonSyntaxViewer jsonString={jsonFormatted} maxHeight={280} />
        </View>

        {/* Copy Action */}
        <View style={styles.actionRow}>
          <CopyReportButton payload={reportPayload} />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagline: {
    letterSpacing: 1,
    fontSize: 10,
    color: '#3B82F6',
  },
  titleText: {
    fontSize: 20,
    lineHeight: 26,
  },
  archiveCountBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#3B82F615',
  },
  chipsScroll: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  dateChip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#33333330',
    backgroundColor: '#33333310',
    gap: 2,
    alignItems: 'center',
  },
  selectedChip: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F620',
  },
  dateChipText: {
    fontSize: 13,
  },
  selectedChipText: {
    color: '#3B82F6',
  },
  chipDateSub: {
    fontSize: 10,
  },
  reportCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deleteButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one + 2,
    backgroundColor: '#EF444415',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 12,
  },
  summaryBox: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
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
    justifyContent: 'flex-start',
    paddingTop: Spacing.one,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  emptyCard: {
    maxWidth: 420,
    alignItems: 'center',
    textAlign: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.one,
  },
  emptyTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  seedButton: {
    marginTop: Spacing.two,
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  seedButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
});
