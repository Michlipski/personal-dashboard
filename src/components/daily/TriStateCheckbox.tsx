import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ItemStatus } from './types';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface TriStateCheckboxProps {
  status: ItemStatus;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
}

export function TriStateCheckbox({
  status,
  onToggle,
  size = 24,
  disabled = false,
}: TriStateCheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.touchable,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: status === 'completed' }}
      accessibilityLabel={`Item status: ${status}. Tap to change.`}
    >
      {status === 'pending' && (
        <View
          style={[
            styles.circle,
            styles.pendingCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: theme.textSecondary,
            },
          ]}
        />
      )}

      {status === 'completed' && (
        <View
          style={[
            styles.circle,
            styles.completedCircle,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <ThemedText style={[styles.markText, { fontSize: size * 0.6 }]}>✓</ThemedText>
        </View>
      )}

      {status === 'missed' && (
        <View
          style={[
            styles.circle,
            styles.missedCircle,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <ThemedText style={[styles.markText, { fontSize: size * 0.6 }]}>✕</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingCircle: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  completedCircle: {
    backgroundColor: '#10B981', // Emerald
  },
  missedCircle: {
    backgroundColor: '#EF4444', // Coral / Red
  },
  markText: {
    color: '#ffffff',
    fontWeight: '700',
    lineHeight: undefined,
  },
});
