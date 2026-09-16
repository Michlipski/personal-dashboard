import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { StartNewDayConfirmModal } from '../StartNewDayConfirmModal';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Primitives/StartNewDayConfirmModal',
  component: StartNewDayConfirmModal,
};

export function Interactive() {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('2026-09-13');
  const [nextDate, setNextDate] = useState('2026-09-14');
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText type="smallBold" style={styles.btnText}>
          🌅 Open Start New Day Modal
        </ThemedText>
      </Pressable>

      {lastAction && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.statusText}>
          Last action: {lastAction}
        </ThemedText>
      )}

      <StartNewDayConfirmModal
        visible={open}
        currentDate={currentDate}
        nextDate={nextDate}
        completedTasksCount={4}
        totalTasksCount={6}
        onClose={() => {
          setOpen(false);
          setLastAction('Cancelled');
        }}
        onConfirm={() => {
          setLastAction(`Confirmed rollover: ${currentDate} → ${nextDate}`);
          setCurrentDate(nextDate);
          const [y, m, d] = nextDate.split('-').map(Number);
          const tomorrow = new Date(Date.UTC(y, m - 1, d + 1));
          setNextDate(tomorrow.toISOString().split('T')[0]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#ffffff',
  },
  statusText: {
    marginTop: Spacing.two,
  },
});
