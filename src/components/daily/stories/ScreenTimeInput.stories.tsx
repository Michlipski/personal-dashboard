import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenTimeInput } from '../ScreenTimeInput';
import { Spacing } from '@/constants/theme';

export default {
  title: 'Daily/Health/ScreenTimeInput',
  component: ScreenTimeInput,
};

export function Interactive() {
  const [total, setTotal] = useState(330);
  const [productive, setProductive] = useState(270);
  const [leisure, setLeisure] = useState(60);

  return (
    <View style={styles.container}>
      <ScreenTimeInput
        totalMinutes={total}
        productiveMinutes={productive}
        leisureMinutes={leisure}
        onChange={(t, p, l) => {
          setTotal(t);
          if (p !== undefined) setProductive(p);
          if (l !== undefined) setLeisure(l);
        }}
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
