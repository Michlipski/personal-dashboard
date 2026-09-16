import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/constants/theme';

export interface AddScheduleItemFabProps {
  onPress: () => void;
}

export function AddScheduleItemFab({ onPress }: AddScheduleItemFabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Add Schedule Item"
    >
      <Text style={styles.plusIcon}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.four,
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6', // Theme primary blue
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    zIndex: 50,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  plusIcon: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
    marginTop: -2,
  },
});
