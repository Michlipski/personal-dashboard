import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MoodRatingCard } from '../MoodRatingCard';
import { MoodRating } from '../types';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Health/MoodRatingCard',
  component: MoodRatingCard,
};

export function Interactive() {
  const [mood, setMood] = useState<MoodRating>('good');
  const [notes, setNotes] = useState(
    'Strong focus during morning session. Well hydrated.'
  );

  return (
    <View style={styles.container}>
      <MoodRatingCard
        mood={mood}
        notes={notes}
        onChangeMood={setMood}
        onChangeNotes={setNotes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    maxWidth: 500,
  },
});
