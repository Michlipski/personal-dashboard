import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DailySubTabs } from '../DailySubTabs';
import { DailyTabMode } from '../types';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Primitives/DailySubTabs',
  component: DailySubTabs,
};

export function Interactive() {
  const [activeTab, setActiveTab] = useState<DailyTabMode>('schedule');

  return (
    <View style={styles.container}>
      <DailySubTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      <ThemedText type="small" themeColor="textSecondary">
        Selected Tab: {activeTab}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
