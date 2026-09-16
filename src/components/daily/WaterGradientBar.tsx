import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Pressable, StyleSheet, View } from 'react-native';
import { DEFAULT_WATER_TARGET_GLASSES, WATER_GRADIENT_CSS } from './constants';
import { getWaterFillPercentage } from './utils/water';

export interface WaterGradientBarProps {
  currentGlasses: number;
  targetGlasses?: number;
  onAddGlass?: () => void;
  onRemoveGlass?: () => void;
}

export function WaterGradientBar({
  currentGlasses,
  targetGlasses = DEFAULT_WATER_TARGET_GLASSES,
  onAddGlass,
  onRemoveGlass,
}: WaterGradientBarProps) {
  const percentage = getWaterFillPercentage(currentGlasses, targetGlasses);
  const percentDisplay = Math.round(percentage * 100);
  const mlDisplay = currentGlasses * 250;
  const targetMl = targetGlasses * 250;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          💧 WATER INTAKE
        </ThemedText>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {percentDisplay}%
        </ThemedText>
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.subtext}>
        {mlDisplay.toLocaleString()} ml of {targetMl.toLocaleString()} ml target
      </ThemedText>

      {/* Bar Row with [-] on left, bar in center, [+] on right */}
      <View style={styles.barControlRow}>
        <Pressable
          onPress={onRemoveGlass}
          disabled={currentGlasses <= 0}
          style={({ pressed }) => [
            styles.iconButton,
            currentGlasses <= 0 && styles.disabledButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Decrease water intake"
        >
          <ThemedText style={styles.iconText}>−</ThemedText>
        </Pressable>

        {/* Spectrum Bar: Underlying Gradient with Opacity Filter Overtop */}
        <View style={styles.track}>
          <View style={styles.underlyingGradient} />
          <View
            style={[
              styles.opacityFilter,
              {
                left: `${percentDisplay}%`,
              },
            ]}
          />
        </View>

        <Pressable
          onPress={onAddGlass}
          style={({ pressed }) => [
            styles.iconButton,
            styles.addButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Increase water intake"
        >
          <ThemedText style={[styles.iconText, styles.addText]}>+</ThemedText>
        </Pressable>
      </View>

      {/* Axis */}
      <View style={styles.legendRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.legendText}>
          0
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.legendText}>
          1500ml
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.legendText}>
          3000ml
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    letterSpacing: 0.5,
  },
  subtext: {
    marginTop: -4,
  },
  barControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2D32',
  },
  iconText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3B82F6',
  },
  addText: {
    color: '#ffffff',
  },
  disabledButton: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  track: {
    flex: 1,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1c1d21',
    overflow: 'hidden',
    position: 'relative',
  },
  underlyingGradient: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: WATER_GRADIENT_CSS,
  },
  opacityFilter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#1c1d21',
    opacity: 0.85,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
  },
  legendText: {
    fontSize: 10,
  },
});
