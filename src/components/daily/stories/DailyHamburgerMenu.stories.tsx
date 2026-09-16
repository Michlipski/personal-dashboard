import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DailyHamburgerMenu } from '../DailyHamburgerMenu';
import { DailyTabMode } from '../types';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Primitives/DailyHamburgerMenu',
  component: DailyHamburgerMenu,
};

export function Interactive() {
  const [activeTab, setActiveTab] = useState<DailyTabMode>('schedule');

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <DailyHamburgerMenu
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          currentRoute="daily"
        />
        <ThemedText type="subtitle">TUESDAY, SEP 15, 2026</ThemedText>
      </View>

      <View style={styles.contentBox}>
        <ThemedText type="small" themeColor="textSecondary">
          Active Tab selected via Hamburger Menu: <ThemedText type="smallBold">{activeTab}</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 4,
  },
  contentBox: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#33333310',
  },
});
