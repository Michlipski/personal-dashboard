import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { DailyReportPayload } from './types';
import { exportDailyReport } from './utils/report';

export interface CopyReportButtonProps {
  payload: DailyReportPayload;
  onCopied?: () => void;
}

export function CopyReportButton({ payload, onCopied }: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    if (exporting) return;
    setExporting(true);
    const success = await exportDailyReport(payload);
    setExporting(false);

    if (success) {
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }) => [
        styles.button,
        copied && styles.buttonCopied,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Copy daily report JSON to clipboard"
    >
      <ThemedText type="smallBold" style={styles.buttonText}>
        {copied ? '✓ Copied to Clipboard!' : '📋 Copy JSON to Clipboard'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCopied: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.85,
  },
});
