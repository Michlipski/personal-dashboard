import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { EnergyLevel } from './types';

export interface EnergyLevelSelectorProps {
  value?: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

const OPTIONS: { level: EnergyLevel; label: string; icon: string; desc: string; color: string }[] = [
  { level: 'low', icon: '🔋', label: 'Low', desc: 'Light review & recovery', color: '#F97316' },
  { level: 'medium', icon: '⚖️', label: 'Medium', desc: 'Structured execution', color: '#EAB308' },
  { level: 'high', icon: '⚡', label: 'High', desc: 'Deep work & practice', color: '#10B981' },
];

export function EnergyLevelSelector({ value, onChange }: EnergyLevelSelectorProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        ⚡ ENERGY LEVEL
      </ThemedText>

      <View style={styles.pillsRow}>
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.level;
          return (
            <Pressable
              key={opt.level}
              onPress={() => onChange(opt.level)}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: theme.background,
                  borderColor: isSelected ? opt.color : theme.backgroundSelected,
                  borderWidth: isSelected ? 2 : 1,
                },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.icon}>{opt.icon}</ThemedText>
              <ThemedText
                type="smallBold"
                themeColor={isSelected ? 'text' : 'textSecondary'}
              >
                {opt.label}
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.descText}
              >
                {opt.desc}
              </ThemedText>
            </Pressable>
          );
        })}
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
  sectionTitle: {
    letterSpacing: 0.5,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  descText: {
    fontSize: 10,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
