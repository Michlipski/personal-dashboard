import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { DailyReportModal } from '../DailyReportModal';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Report/DailyReportModal',
  component: DailyReportModal,
};

export function Interactive() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText type="smallBold" style={styles.btnText}>
          Open Daily Report Modal
        </ThemedText>
      </Pressable>

      <DailyReportModal visible={open} onClose={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#ffffff',
  },
});
