import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ScreenTimeInputProps {
  totalMinutes: number;
  productiveMinutes?: number;
  leisureMinutes?: number;
  onChange: (total: number, productive?: number, leisure?: number) => void;
}

export function ScreenTimeInput({
  totalMinutes,
  productiveMinutes = 0,
  leisureMinutes = 0,
  onChange,
}: ScreenTimeInputProps) {
  const theme = useTheme();

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinsRem = totalMinutes % 60;

  const productiveHours = Math.floor(productiveMinutes / 60);
  const productiveMinsRem = productiveMinutes % 60;

  const leisureHours = Math.floor(leisureMinutes / 60);
  const leisureMinsRem = leisureMinutes % 60;

  const adjustTotal = (deltaMinutes: number) => {
    const nextTotal = Math.max(0, totalMinutes + deltaMinutes);
    onChange(nextTotal, productiveMinutes, leisureMinutes);
  };

  const adjustProductive = (deltaMinutes: number) => {
    const nextProd = Math.max(0, productiveMinutes + deltaMinutes);
    onChange(totalMinutes, nextProd, leisureMinutes);
  };

  const adjustLeisure = (deltaMinutes: number) => {
    const nextLeisure = Math.max(0, leisureMinutes + deltaMinutes);
    onChange(totalMinutes, productiveMinutes, nextLeisure);
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        📱 SCREEN TIME
      </ThemedText>

      {/* Total Screen Time Stepper */}
      <View style={styles.metricRow}>
        <View style={styles.labelCol}>
          <ThemedText type="smallBold">Total Screen Time</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {totalHours}h {totalMinsRem}m ({totalMinutes} mins)
          </ThemedText>
        </View>

        <View style={styles.stepperGroup}>
          <Pressable
            onPress={() => adjustTotal(-15)}
            disabled={totalMinutes <= 0}
            style={({ pressed }) => [
              styles.stepBtn,
              { backgroundColor: theme.background },
              totalMinutes <= 0 && styles.disabledBtn,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText type="smallBold">-15m</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => adjustTotal(15)}
            style={({ pressed }) => [
              styles.stepBtn,
              { backgroundColor: theme.background },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText type="smallBold">+15m</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Sub-breakdown: Deep Work & Leisure */}
      <View style={styles.subBreakdownContainer}>
        {/* Productive Deep Work */}
        <View style={styles.splitRow}>
          <View style={styles.labelCol}>
            <ThemedText type="small">💼 Deep Work / Productive</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subStatText}>
              {productiveHours}h {productiveMinsRem}m
            </ThemedText>
          </View>
          <View style={styles.miniStepperGroup}>
            <Pressable
              onPress={() => adjustProductive(-15)}
              disabled={productiveMinutes <= 0}
              style={({ pressed }) => [
                styles.miniStepBtn,
                { backgroundColor: theme.background },
                productiveMinutes <= 0 && styles.disabledBtn,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText type="small">-15m</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => adjustProductive(15)}
              style={({ pressed }) => [
                styles.miniStepBtn,
                { backgroundColor: theme.background },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText type="small">+15m</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Leisure / Social */}
        <View style={styles.splitRow}>
          <View style={styles.labelCol}>
            <ThemedText type="small">🍿 Leisure / Social Media</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subStatText}>
              {leisureHours}h {leisureMinsRem}m
            </ThemedText>
          </View>
          <View style={styles.miniStepperGroup}>
            <Pressable
              onPress={() => adjustLeisure(-15)}
              disabled={leisureMinutes <= 0}
              style={({ pressed }) => [
                styles.miniStepBtn,
                { backgroundColor: theme.background },
                leisureMinutes <= 0 && styles.disabledBtn,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText type="small">-15m</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => adjustLeisure(15)}
              style={({ pressed }) => [
                styles.miniStepBtn,
                { backgroundColor: theme.background },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText type="small">+15m</ThemedText>
            </Pressable>
          </View>
        </View>
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  labelCol: {
    gap: 2,
  },
  stepperGroup: {
    flexDirection: 'row',
    gap: Spacing.one + 2,
  },
  stepBtn: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 4,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBreakdownContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#33333330',
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subStatText: {
    fontSize: 12,
  },
  miniStepperGroup: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  miniStepBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
});
