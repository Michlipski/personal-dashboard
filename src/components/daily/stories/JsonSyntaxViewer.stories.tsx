import React from 'react';
import { StyleSheet, View } from 'react-native';
import { JsonSyntaxViewer } from '../JsonSyntaxViewer';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Report/JsonSyntaxViewer',
  component: JsonSyntaxViewer,
};

const samplePayload = {
  reportVersion: '1.0',
  date: '2026-09-09',
  summary: {
    totalScheduledMinutes: 480,
    completedMinutes: 390,
    completionRate: 0.81,
  },
  scheduleItems: [
    { id: '1', title: '🎹 Piano Practice: Chopin Op. 9 No. 2', status: 'completed' },
    { id: '2', title: 'Architectural Review', status: 'completed' },
  ],
};

export function DefaultViewer() {
  return (
    <View style={styles.container}>
      <JsonSyntaxViewer jsonString={JSON.stringify(samplePayload, null, 2)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    maxWidth: 500,
  },
});
