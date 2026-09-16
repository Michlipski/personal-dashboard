import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CopyReportButton } from '../CopyReportButton';
import { DailyReportPayload } from '../types';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Report/CopyReportButton',
  component: CopyReportButton,
};

const samplePayload: DailyReportPayload = {
  reportVersion: '1.0',
  generatedAt: new Date().toISOString(),
  date: '2026-09-09',
  summary: {
    totalScheduledMinutes: 480,
    completedMinutes: 390,
    completionRate: 0.81,
    zeroDurationItemsTotal: 2,
    zeroDurationItemsCompleted: 2,
  },
  scheduleItems: [],
  healthVitals: {
    date: '2026-09-09',
    waterIntake: { glasses: 7, targetGlasses: 8, milliliters: 1750, percentageOfTarget: 0.88 },
    energyLevel: 'medium',
    mood: 'good',
    screenTime: { totalMinutes: 300 },
    lastUpdated: new Date().toISOString(),
  },
};

export function Interactive() {
  return (
    <View style={styles.container}>
      <CopyReportButton payload={samplePayload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    maxWidth: 320,
  },
});
