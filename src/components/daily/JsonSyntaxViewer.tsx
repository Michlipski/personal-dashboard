import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';

export interface JsonSyntaxViewerProps {
  jsonString: string;
  maxHeight?: number;
}

export function JsonSyntaxViewer({ jsonString, maxHeight = 300 }: JsonSyntaxViewerProps) {
  return (
    <ThemedView type="background" style={[styles.codeBox, { maxHeight }]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <ThemedText
            selectable={true}
            type="code"
            style={styles.codeText}
          >
            {jsonString}
          </ThemedText>
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  codeBox: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    borderWidth: 1,
    borderColor: '#33333340',
  },
  codeText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
});
