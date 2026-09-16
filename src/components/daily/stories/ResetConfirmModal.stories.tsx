import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ResetConfirmModal } from '../ResetConfirmModal';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Primitives/ResetConfirmModal',
  component: ResetConfirmModal,
};

export function Interactive() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText type="smallBold" style={styles.btnText}>
          Open Reset Confirmation Modal
        </ThemedText>
      </Pressable>

      {lastAction && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.statusText}>
          Last action: {lastAction}
        </ThemedText>
      )}

      <ResetConfirmModal
        visible={open}
        onClose={() => {
          setOpen(false);
          setLastAction('Cancelled');
        }}
        onConfirm={() => {
          setLastAction('Confirmed Reset (' + new Date().toLocaleTimeString() + ')');
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
    backgroundColor: '#EF4444',
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
