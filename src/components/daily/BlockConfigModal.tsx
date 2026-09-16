import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SESSION_TYPE_COLORS, SESSION_TYPE_LABELS, SESSION_TYPES } from './constants';
import { ItemStatus, ScheduleBlock, ScheduleBlockType, SessionType } from './types';
import { recalculateTime } from './utils/time';

export interface BlockConfigModalProps {
  visible: boolean;
  block?: ScheduleBlock | null; // null/undefined means creation mode
  onClose: () => void;
  onSave: (blockData: Omit<ScheduleBlock, 'id'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export function BlockConfigModal({
  visible,
  block,
  onClose,
  onSave,
  onDelete,
}: BlockConfigModalProps) {
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ScheduleBlockType>('loose');
  const [sessionType, setSessionType] = useState<SessionType>('focus_deep_work');
  const [status, setStatus] = useState<ItemStatus>('pending');
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [endTime, setEndTime] = useState('09:30');
  const [objectiveId, setObjectiveId] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when modal opens or block changes
  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setType(block.type);
      setSessionType(block.sessionType);
      setStatus(block.status);
      setStartTime(block.startTime);
      setDurationMinutes(block.durationMinutes);
      setEndTime(block.endTime);
      setObjectiveId(block.objectiveId || '');
      setNotes(block.notes || '');
    } else {
      setTitle('');
      setType('loose');
      setSessionType('focus_deep_work');
      setStatus('pending');
      setStartTime('09:00');
      setDurationMinutes(30);
      setEndTime('09:30');
      setObjectiveId('');
      setNotes('');
    }
  }, [block, visible]);

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    if (type !== 'zero_duration') {
      const recalculated = recalculateTime('startTime', {
        startTime: val,
        durationMinutes,
        endTime,
      });
      setEndTime(recalculated.endTime);
    } else {
      setEndTime(val);
    }
  };

  const handleDurationChange = (minutes: number) => {
    const safeMinutes = Math.max(0, minutes);
    setDurationMinutes(safeMinutes);
    const recalculated = recalculateTime('duration', {
      startTime,
      durationMinutes: safeMinutes,
      endTime,
    });
    setEndTime(recalculated.endTime);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTime(val);
    if (type !== 'zero_duration') {
      const recalculated = recalculateTime('endTime', {
        startTime,
        durationMinutes,
        endTime: val,
      });
      setDurationMinutes(recalculated.durationMinutes);
    }
  };

  const handleTypeChange = (newType: ScheduleBlockType) => {
    setType(newType);
    if (newType === 'zero_duration') {
      setDurationMinutes(0);
      setEndTime(startTime);
      setSessionType('habit_checkpoint');
    } else {
      if (durationMinutes === 0) {
        setDurationMinutes(30);
        const recalculated = recalculateTime('duration', {
          startTime,
          durationMinutes: 30,
          endTime,
        });
        setEndTime(recalculated.endTime);
      }
      if (sessionType === 'habit_checkpoint') {
        setSessionType(newType === 'strict' ? 'appointment' : 'focus_deep_work');
      }
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const payload: Omit<ScheduleBlock, 'id'> = {
      title: title.trim(),
      type,
      sessionType,
      startTime,
      durationMinutes: type === 'zero_duration' ? 0 : durationMinutes,
      endTime: type === 'zero_duration' ? startTime : endTime,
      status,
      objectiveId: objectiveId.trim() || undefined,
      notes: notes.trim() || undefined,
      completedAt: status === 'completed' ? block?.completedAt || new Date().toISOString() : undefined,
      missedAt: status === 'missed' ? block?.missedAt || new Date().toISOString() : undefined,
    };

    onSave(payload, block?.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ThemedView type="backgroundElement" style={styles.modalCard}>
          <ThemedText type="subtitle" style={styles.modalHeader}>
            {block ? 'Edit Schedule Block' : 'New Schedule Item'}
          </ThemedText>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Item Title</ThemedText>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Piano Practice: Chopin Op. 9 No. 2"
                placeholderTextColor={theme.textSecondary}
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

            {/* Block Type Selector */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Block Type</ThemedText>
              <View style={styles.rowSelector}>
                {(['strict', 'loose', 'zero_duration'] as ScheduleBlockType[]).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => handleTypeChange(t)}
                    style={[
                      styles.choicePill,
                      { backgroundColor: theme.background },
                      type === t && { borderColor: '#3B82F6', borderWidth: 2 },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      themeColor={type === t ? 'text' : 'textSecondary'}
                    >
                      {t === 'strict'
                        ? 'Strict (Fixed)'
                        : t === 'loose'
                          ? 'Loose (Flex)'
                          : 'Habit (0m)'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Status Radio */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Status</ThemedText>
              <View style={styles.rowSelector}>
                {(['pending', 'completed', 'missed'] as ItemStatus[]).map((st) => (
                  <Pressable
                    key={st}
                    onPress={() => setStatus(st)}
                    style={[
                      styles.choicePill,
                      { backgroundColor: theme.background },
                      status === st && {
                        borderColor:
                          st === 'completed'
                            ? '#10B981'
                            : st === 'missed'
                              ? '#EF4444'
                              : '#94A3B8',
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      themeColor={status === st ? 'text' : 'textSecondary'}
                    >
                      {st === 'pending'
                        ? '○ Pending'
                        : st === 'completed'
                          ? '🟢 Completed'
                          : '🔴 Missed'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Time Controls */}
            <View style={styles.timeRowContainer}>
              <View style={styles.timeColumn}>
                <ThemedText type="smallBold">Start Time</ThemedText>
                <TextInput
                  value={startTime}
                  onChangeText={handleStartTimeChange}
                  placeholder="HH:mm"
                  maxLength={5}
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.timeInput,
                    {
                      color: theme.text,
                      backgroundColor: theme.background,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}
                />
              </View>

              {type !== 'zero_duration' ? (
                <>
                  <View style={styles.timeColumn}>
                    <ThemedText type="smallBold">Duration (m)</ThemedText>
                    <TextInput
                      value={durationMinutes.toString()}
                      onChangeText={(v) => handleDurationChange(parseInt(v, 10) || 0)}
                      keyboardType="numeric"
                      placeholderTextColor={theme.textSecondary}
                      style={[
                        styles.timeInput,
                        {
                          color: theme.text,
                          backgroundColor: theme.background,
                          borderColor: theme.backgroundSelected,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.timeColumn}>
                    <ThemedText type="smallBold">End Time</ThemedText>
                    <TextInput
                      value={endTime}
                      onChangeText={handleEndTimeChange}
                      placeholder="HH:mm"
                      maxLength={5}
                      placeholderTextColor={theme.textSecondary}
                      style={[
                        styles.timeInput,
                        {
                          color: theme.text,
                          backgroundColor: theme.background,
                          borderColor: theme.backgroundSelected,
                        },
                      ]}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.timeColumn}>
                  <ThemedText type="smallBold">Duration</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.lockedTimeNotice}>
                    0 mins (Instant)
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Session Category Selector */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Session Category</ThemedText>
              <View style={styles.categoriesWrap}>
                {SESSION_TYPES.map((st) => {
                  const isSelected = sessionType === st;
                  const catColor = SESSION_TYPE_COLORS[st] || '#3B82F6';
                  return (
                    <Pressable
                      key={st}
                      onPress={() => setSessionType(st)}
                      style={[
                        styles.categoryPill,
                        { backgroundColor: theme.background },
                        isSelected && { borderColor: catColor, borderWidth: 2 },
                      ]}
                    >
                      <View style={[styles.colorDot, { backgroundColor: catColor }]} />
                      <ThemedText
                        type="small"
                        themeColor={isSelected ? 'text' : 'textSecondary'}
                      >
                        {SESSION_TYPE_LABELS[st]}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Objective Link */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Link to Objective (Optional)</ThemedText>
              <TextInput
                value={objectiveId}
                onChangeText={setObjectiveId}
                placeholder="e.g. obj-piano-mastery"
                placeholderTextColor={theme.textSecondary}
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

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold">Notes & Directives</ThemedText>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Focus cues, specific measures, or reflections..."
                multiline
                numberOfLines={3}
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.textArea,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {block && onDelete && (
              <Pressable
                onPress={() => {
                  onDelete(block.id);
                  onClose();
                }}
                style={styles.deleteButton}
              >
                <ThemedText type="smallBold" style={styles.deleteText}>
                  Delete
                </ThemedText>
              </Pressable>
            )}

            <View style={styles.rightActions}>
              <Pressable onPress={onClose} style={styles.cancelButton}>
                <ThemedText type="small" themeColor="textSecondary">
                  Cancel
                </ThemedText>
              </Pressable>

              <Pressable onPress={handleSave} style={styles.saveButton}>
                <ThemedText type="smallBold" style={styles.saveText}>
                  Save
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalHeader: {
    fontSize: 22,
    lineHeight: 28,
  },
  scrollBody: {
    maxHeight: 480,
  },
  fieldGroup: {
    gap: 6,
    marginBottom: Spacing.three,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  rowSelector: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  choicePill: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeRowContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  timeColumn: {
    flex: 1,
    gap: 6,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 15,
    textAlign: 'center',
  },
  lockedTimeNotice: {
    paddingVertical: Spacing.two,
    textAlign: 'center',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Spacing.two,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#33333330',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginLeft: 'auto',
  },
  cancelButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  saveText: {
    color: '#ffffff',
  },
  deleteButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  deleteText: {
    color: '#EF4444',
  },
});
