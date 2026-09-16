import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WaterGradientBar } from '../WaterGradientBar';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Health/WaterGradientBar',
  component: WaterGradientBar,
};

export function Interactive() {
  const [glasses, setGlasses] = useState(9);

  return (
    <View style={styles.container}>
      <WaterGradientBar
        currentGlasses={glasses}
        targetGlasses={12}
        onAddGlass={() => setGlasses((g) => g + 1)}
        onRemoveGlass={() => setGlasses((g) => Math.max(0, g - 1))}
      />
    </View>
  );
}

export function StatesOverview() {
  return (
    <View style={styles.column}>
      <WaterGradientBar currentGlasses={2} targetGlasses={12} />
      <WaterGradientBar currentGlasses={6} targetGlasses={12} />
      <WaterGradientBar currentGlasses={9} targetGlasses={12} />
      <WaterGradientBar currentGlasses={12} targetGlasses={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    maxWidth: 500,
  },
  column: {
    padding: Spacing.three,
    gap: Spacing.three,
    maxWidth: 500,
  },
});
