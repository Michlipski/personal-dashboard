import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DailyPastReportsScreen } from '../DailyPastReportsScreen';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Report/DailyPastReportsScreen',
  component: DailyPastReportsScreen,
};

export function Interactive() {
  return (
    <View style={styles.container}>
      <DailyPastReportsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 650,
  },
});
