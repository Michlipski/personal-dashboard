import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlockConfigModal } from '../BlockConfigModal';
import { ScheduleBlock } from '../types';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Schedule/BlockConfigModal',
  component: BlockConfigModal,
};

const sampleBlock: ScheduleBlock = {
  id: 'block-1',
  title: '🎹 Piano Practice: Chopin Op. 9 No. 2',
  type: 'loose',
  sessionType: 'deliberate_practice',
  startTime: '13:30',
  durationMinutes: 45,
  endTime: '14:15',
  status: 'pending',
  objectiveId: 'obj-piano-mastery',
  notes: 'Page 1 hands together',
};

export function EditMode() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText type="smallBold" style={styles.btnText}>
          Open Modal (Edit Mode)
        </ThemedText>
      </Pressable>

      <BlockConfigModal
        visible={open}
        block={sampleBlock}
        onClose={() => setOpen(false)}
        onSave={(data) => alert(`Saved: ${data.title}`)}
        onDelete={() => alert('Deleted')}
      />
    </View>
  );
}

export function CreateMode() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText type="smallBold" style={styles.btnText}>
          Open Modal (Create Mode)
        </ThemedText>
      </Pressable>

      <BlockConfigModal
        visible={open}
        block={null}
        onClose={() => setOpen(false)}
        onSave={(data) => alert(`Created: ${data.title}`)}
      />
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
