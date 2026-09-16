import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LeftLaneDurationBlock } from '../LeftLaneDurationBlock';
import { ScheduleBlock, ItemStatus } from '../types';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Schedule/LeftLaneDurationBlock',
  component: LeftLaneDurationBlock,
};

const baseBlock: ScheduleBlock = {
  id: 'block-story-1',
  title: '🎹 Piano Practice: Chopin Nocturne Op. 9 No. 2',
  type: 'loose',
  sessionType: 'deliberate_practice',
  startTime: '13:30',
  durationMinutes: 45,
  endTime: '14:15',
  status: 'pending',
  notes: 'Focused on Page 1 measures 8-12 hands together.',
};

export function StandardBlock() {
  const [block, setBlock] = useState<ScheduleBlock>(baseBlock);

  const toggleStatus = () => {
    const next: Record<ItemStatus, ItemStatus> = {
      pending: 'completed',
      completed: 'missed',
      missed: 'pending',
    };
    setBlock((b) => ({ ...b, status: next[b.status] }));
  };

  return (
    <View style={styles.canvas}>
      <LeftLaneDurationBlock
        block={block}
        hourHeight={80}
        onPress={() => alert(`Clicked: ${block.title}`)}
        onToggleStatus={toggleStatus}
      />
    </View>
  );
}

export function StrictAppointment() {
  const appointmentBlock: ScheduleBlock = {
    ...baseBlock,
    id: 'block-story-2',
    title: 'Dr. Appointment & Health Check',
    type: 'strict',
    sessionType: 'appointment',
    startTime: '10:00',
    durationMinutes: 60,
    endTime: '11:00',
    status: 'completed',
  };

  return (
    <View style={styles.canvas}>
      <LeftLaneDurationBlock
        block={appointmentBlock}
        hourHeight={80}
        onPress={() => {}}
        onToggleStatus={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 180,
    width: 320,
    position: 'relative',
    padding: Spacing.two,
  },
});
