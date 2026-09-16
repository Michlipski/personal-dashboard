import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { DailyTabMode } from './types';

export interface DailySubTabsProps {
  activeTab: DailyTabMode;
  onChangeTab: (tab: DailyTabMode) => void;
}

export function DailySubTabs({ activeTab, onChangeTab }: DailySubTabsProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <Pressable
        onPress={() => onChangeTab('schedule')}
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.pressed,
        ]}
      >
        <ThemedView
          type={activeTab === 'schedule' ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.pill}
        >
          <ThemedText
            type="smallBold"
            themeColor={activeTab === 'schedule' ? 'text' : 'textSecondary'}
          >
            📅 Schedule & Plan
          </ThemedText>
        </ThemedView>
      </Pressable>

      <Pressable
        onPress={() => onChangeTab('vitals')}
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.pressed,
        ]}
      >
        <ThemedView
          type={activeTab === 'vitals' ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.pill}
        >
          <ThemedText
            type="smallBold"
            themeColor={activeTab === 'vitals' ? 'text' : 'textSecondary'}
          >
            💧 Health & Vitals
          </ThemedText>
        </ThemedView>
      </Pressable>

      <Pressable
        onPress={() => onChangeTab('reports')}
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.pressed,
        ]}
      >
        <ThemedView
          type={activeTab === 'reports' ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.pill}
        >
          <ThemedText
            type="smallBold"
            themeColor={activeTab === 'reports' ? 'text' : 'textSecondary'}
          >
            📜 Past Reports
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.half,
    borderRadius: Spacing.four,
    alignSelf: 'flex-start',
    gap: Spacing.one,
  },
  tabButton: {
    borderRadius: Spacing.three,
  },
  pill: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
