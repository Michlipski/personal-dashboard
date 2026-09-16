import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DailyScreen } from '../DailyScreen';

export default {
  title: 'Daily/FullView/DailyScreen',
  component: DailyScreen,
};

export function DefaultView() {
  return (
    <View style={styles.container}>
      <DailyScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 750,
  },
});
