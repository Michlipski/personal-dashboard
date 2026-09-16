import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface StartNewDayConfirmModalProps {
  visible: boolean;
  currentDate: string;
  nextDate: string;
  onClose: () => void;
  onConfirm: () => void;
  completedTasksCount?: number;
  totalTasksCount?: number;
}

export function StartNewDayConfirmModal({
  visible,
  currentDate,
  nextDate,
  onClose,
  onConfirm,
  completedTasksCount = 0,
  totalTasksCount = 0,
}: StartNewDayConfirmModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ThemedView type="backgroundElement" style={styles.modalCard}>
          {/* Header Icon & Title */}
          <View style={styles.iconHeader}>
            <View style={styles.sunriseCircle}>
              <ThemedText style={styles.sunriseIcon}>🌅</ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.title}>
              Start a New Day?
            </ThemedText>
          </View>

          {/* Date Transition Card */}
          <View style={[styles.dateTransitionBox, { backgroundColor: theme.background }]}>
            <View style={styles.dateCol}>
              <ThemedText type="small" themeColor="textSecondary">
                ARCHIVING TODAY
              </ThemedText>
              <ThemedText type="smallBold" style={styles.dateValue}>
                {currentDate}
              </ThemedText>
            </View>
            <ThemedText style={styles.arrowIcon}>→</ThemedText>
            <View style={styles.dateCol}>
              <ThemedText type="small" themeColor="textSecondary">
                ROLLING OVER TO
              </ThemedText>
              <ThemedText type="smallBold" style={[styles.dateValue, { color: '#10B981' }]}>
                {nextDate}
              </ThemedText>
            </View>
          </View>

          {/* Explanation */}
          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            Today's complete summary report and health vitals will be saved and archived as a JSON snapshot in local client storage.
          </ThemedText>

          {/* Summary Snapshot Badge */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.background }]}>
              <ThemedText type="small" themeColor="textSecondary">
                Tasks Completed:
              </ThemedText>
              <ThemedText type="smallBold">
                {completedTasksCount} of {totalTasksCount}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.background }]}>
              <ThemedText type="small" themeColor="textSecondary">
                New Day Routine:
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: '#10B981' }}>
                Reset & Ready
              </ThemedText>
            </View>
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.subtext}>
            Tomorrow's dashboard will open with fresh habit checklists and reset vitals.
          </ThemedText>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: theme.background },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel starting new day"
            >
              <ThemedText type="smallBold" themeColor="textSecondary">
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirm start new day"
            >
              <ThemedText type="smallBold" style={styles.confirmButtonText}>
                Archive & Start Day
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconHeader: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  sunriseCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunriseIcon: {
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  dateTransitionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  dateCol: {
    alignItems: 'center',
    gap: 2,
  },
  dateValue: {
    fontSize: 14,
  },
  arrowIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  badge: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: 2,
  },
  subtext: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
});
