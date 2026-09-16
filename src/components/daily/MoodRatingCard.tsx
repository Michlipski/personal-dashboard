import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MoodRating } from './types';

export interface MoodRatingCardProps {
  mood?: MoodRating;
  notes?: string;
  onChangeMood: (mood: MoodRating) => void;
  onChangeNotes: (notes: string) => void;
}

const MOOD_OPTIONS: { mood: MoodRating; icon: string; label: string; color: string }[] = [
  { mood: 'stressed', icon: '😣', label: 'Stressed', color: '#EF4444' },
  { mood: 'low', icon: '😔', label: 'Low', color: '#F97316' },
  { mood: 'neutral', icon: '😐', label: 'Neutral', color: '#EAB308' },
  { mood: 'good', icon: '🙂', label: 'Good', color: '#38BDF8' },
  { mood: 'great', icon: '😄', label: 'Great', color: '#10B981' },
];

export function MoodRatingCard({
  mood,
  notes = '',
  onChangeMood,
  onChangeNotes,
}: MoodRatingCardProps) {
  const theme = useTheme();
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleNotesBlur = () => {
    if (localNotes !== notes) {
      onChangeNotes(localNotes);
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" style={styles.sectionTitle}>
        🧠 MOOD & STATE
      </ThemedText>

      {/* 5-choice horizontal pills */}
      <View style={styles.pillsRow}>
        {MOOD_OPTIONS.map((opt) => {
          const isSelected = mood === opt.mood;
          return (
            <Pressable
              key={opt.mood}
              onPress={() => onChangeMood(opt.mood)}
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
                type="small"
                themeColor={isSelected ? 'text' : 'textSecondary'}
                style={styles.pillLabel}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Qualitative reflection input */}
      <View style={styles.notesContainer}>
        <ThemedText type="small" themeColor="textSecondary">
          Daily Reflection / Physiological Notes
        </ThemedText>
        <TextInput
          value={localNotes}
          onChangeText={setLocalNotes}
          onBlur={handleNotesBlur}
          placeholder="e.g. Slept well, mentally sharp during deep work, hit a minor wall around 3pm..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={2}
          style={[
            styles.textInput,
            {
              color: theme.text,
              backgroundColor: theme.background,
              borderColor: theme.backgroundSelected,
            },
          ]}
        />
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
    gap: Spacing.one + 2,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  notesContainer: {
    gap: 6,
    marginTop: Spacing.one,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 13,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.8,
  },
});
