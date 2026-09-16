import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EnergyLevelSelector } from '../EnergyLevelSelector';
import { EnergyLevel } from '../types';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Health/EnergyLevelSelector',
  component: EnergyLevelSelector,
};

export function Interactive() {
  const [level, setLevel] = useState<EnergyLevel>('medium');

  return (
    <View style={styles.container}>
      <EnergyLevelSelector value={level} onChange={setLevel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    maxWidth: 500,
  },
});
