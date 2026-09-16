import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useHealthMetricsStore } from './stores/useHealthMetricsStore';
import { WaterGradientBar } from './WaterGradientBar';
import { EnergyLevelSelector } from './EnergyLevelSelector';
import { MoodRatingCard } from './MoodRatingCard';
import { ScreenTimeInput } from './ScreenTimeInput';

export function DailyHealthScreen() {
  const metrics = useHealthMetricsStore((state) => state.metrics);
  const addWaterGlass = useHealthMetricsStore((state) => state.addWaterGlass);
  const removeWaterGlass = useHealthMetricsStore((state) => state.removeWaterGlass);
  const setEnergyLevel = useHealthMetricsStore((state) => state.setEnergyLevel);
  const setMood = useHealthMetricsStore((state) => state.setMood);
  const setMoodNotes = useHealthMetricsStore((state) => state.setMoodNotes);
  const setScreenTime = useHealthMetricsStore((state) => state.setScreenTime);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WaterGradientBar
          currentGlasses={metrics.waterIntake.glasses}
          targetGlasses={metrics.waterIntake.targetGlasses}
          onAddGlass={addWaterGlass}
          onRemoveGlass={removeWaterGlass}
        />

        <EnergyLevelSelector
          value={metrics.energyLevel}
          onChange={setEnergyLevel}
        />

        <MoodRatingCard
          mood={metrics.mood}
          notes={metrics.moodNotes}
          onChangeMood={(m) => setMood(m)}
          onChangeNotes={setMoodNotes}
        />

        <ScreenTimeInput
          totalMinutes={metrics.screenTime.totalMinutes}
          productiveMinutes={metrics.screenTime.productiveMinutes}
          leisureMinutes={metrics.screenTime.leisureMinutes}
          onChange={setScreenTime}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
});
