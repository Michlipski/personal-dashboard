import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TriStateCheckbox } from '../TriStateCheckbox';
import { ItemStatus } from '../types';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Primitives/TriStateCheckbox',
  component: TriStateCheckbox,
};

export function Interactive() {
  const [status, setStatus] = useState<ItemStatus>('pending');
  const cycle = () => {
    setStatus((prev) =>
      prev === 'pending' ? 'completed' : prev === 'completed' ? 'missed' : 'pending'
    );
  };

  return (
    <View style={styles.row}>
      <TriStateCheckbox status={status} onToggle={cycle} size={28} />
      <ThemedText type="default">Current Status: {status.toUpperCase()} (Tap to cycle)</ThemedText>
    </View>
  );
}

export function AllStates() {
  return (
    <View style={styles.grid}>
      <View style={styles.item}>
        <TriStateCheckbox status="pending" onToggle={() => {}} size={28} />
        <ThemedText type="small">Pending (○)</ThemedText>
      </View>
      <View style={styles.item}>
        <TriStateCheckbox status="completed" onToggle={() => {}} size={28} />
        <ThemedText type="small">Completed (🟢)</ThemedText>
      </View>
      <View style={styles.item}>
        <TriStateCheckbox status="missed" onToggle={() => {}} size={28} />
        <ThemedText type="small">Missed (🔴)</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.four,
    padding: Spacing.three,
  },
  item: {
    alignItems: 'center',
    gap: Spacing.one,
  },
});
