import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RightLaneZeroDurationBlock } from '../RightLaneZeroDurationBlock';
import { PositionedZeroDurationItem, ItemStatus } from '../types';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Schedule/RightLaneZeroDurationBlock',
  component: RightLaneZeroDurationBlock,
};

export function StandardHabit() {
  const [status, setStatus] = useState<ItemStatus>('pending');
  const item: PositionedZeroDurationItem = {
    block: {
      id: 'habit-1',
      title: 'Take Vitamin D3 & K2',
      type: 'zero_duration',
      sessionType: 'habit_checkpoint',
      startTime: '08:00',
      durationMinutes: 0,
      endTime: '08:00',
      status,
    },
    anchorY: 20,
    renderedY: 20,
    isDisplaced: false,
  };

  const cycle = () => {
    setStatus((s) => (s === 'pending' ? 'completed' : s === 'completed' ? 'missed' : 'pending'));
  };

  return (
    <View style={styles.canvas}>
      <RightLaneZeroDurationBlock
        item={item}
        onPress={() => alert('Habit clicked')}
        onToggleStatus={cycle}
      />
    </View>
  );
}

export function DisplacedWithLeaderLine() {
  const item: PositionedZeroDurationItem = {
    block: {
      id: 'habit-2',
      title: 'Afternoon Meds (Displaced)',
      type: 'zero_duration',
      sessionType: 'habit_checkpoint',
      startTime: '13:00',
      durationMinutes: 0,
      endTime: '13:00',
      status: 'completed',
    },
    anchorY: 10,
    renderedY: 60,
    isDisplaced: true,
  };

  return (
    <View style={styles.canvas}>
      <RightLaneZeroDurationBlock
        item={item}
        onPress={() => {}}
        onToggleStatus={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 140,
    width: 280,
    position: 'relative',
    paddingLeft: 40,
  },
});
