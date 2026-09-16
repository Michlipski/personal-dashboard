import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Timeline24Hour } from '../Timeline24Hour';
import { INITIAL_SCHEDULE_BLOCKS } from '../stores/useScheduleStore';
import { ScheduleBlock, ItemStatus } from '../types';

export default {
  title: 'Daily/Schedule/Timeline24Hour',
  component: Timeline24Hour,
};

export function DefaultTimeline() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(INITIAL_SCHEDULE_BLOCKS);

  const toggleStatus = (id: string) => {
    const next: Record<ItemStatus, ItemStatus> = {
      pending: 'completed',
      completed: 'missed',
      missed: 'pending',
    };
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: next[b.status] } : b))
    );
  };

  return (
    <View style={styles.container}>
      <Timeline24Hour
        blocks={blocks}
        onPressBlock={(b) => alert(`Selected: ${b.title}`)}
        onToggleStatus={toggleStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 600,
    width: '100%',
    maxWidth: 720,
    borderWidth: 1,
    borderColor: '#33333330',
  },
});
