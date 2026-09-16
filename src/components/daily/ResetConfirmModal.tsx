import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ResetConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({
  visible,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) {
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
          <View style={styles.iconHeader}>
            <View style={styles.warningCircle}>
              <ThemedText style={styles.warningIcon}>⚠️</ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.title}>
              Reset Today's Dashboard?
            </ThemedText>
          </View>

          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            Are you sure you want to reset today's data? All schedule item statuses will be returned to pending, and health vitals (water intake, energy, mood, screen time) will be restored to their clean defaults.
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.subtext}>
            This action immediately updates local storage and cannot be undone.
          </ThemedText>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: theme.background },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel reset"
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
                styles.resetButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirm reset"
            >
              <ThemedText type="smallBold" style={styles.resetButtonText}>
                Reset Today's Data
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
  warningCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF444420',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
  },
  resetButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
});
