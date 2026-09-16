import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useScheduleStore } from './stores/useScheduleStore';
import { ScheduleBlock } from './types';
import { Timeline24Hour } from './Timeline24Hour';
import { AddScheduleItemFab } from './AddScheduleItemFab';
import { BlockConfigModal } from './BlockConfigModal';
import { getNextQuarterHour } from './utils/time';

export interface DailyScheduleScreenProps {
  onOpenReport?: () => void;
}

export function DailyScheduleScreen({ onOpenReport }: DailyScheduleScreenProps) {
  const blocks = useScheduleStore((state) => state.blocks);
  const cycleStatus = useScheduleStore((state) => state.cycleStatus);
  const addBlock = useScheduleStore((state) => state.addBlock);
  const updateBlock = useScheduleStore((state) => state.updateBlock);
  const deleteBlock = useScheduleStore((state) => state.deleteBlock);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState<ScheduleBlock | null>(null);

  const handleOpenCreateModal = () => {
    const nextStart = getNextQuarterHour();
    setActiveBlock({
      id: '',
      title: '',
      type: 'loose',
      sessionType: 'focus_deep_work',
      startTime: nextStart,
      durationMinutes: 30,
      endTime: '',
      status: 'pending',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (block: ScheduleBlock) => {
    setActiveBlock(block);
    setIsModalOpen(true);
  };

  const handleSaveBlock = (blockData: Omit<ScheduleBlock, 'id'>, existingId?: string) => {
    if (existingId) {
      updateBlock(existingId, blockData);
    } else {
      addBlock(blockData);
    }
  };

  const handleDeleteBlock = (id: string) => {
    deleteBlock(id);
  };

  return (
    <ThemedView style={styles.container}>
      <Timeline24Hour
        blocks={blocks}
        onPressBlock={handleOpenEditModal}
        onToggleStatus={cycleStatus}
      />

      <AddScheduleItemFab onPress={handleOpenCreateModal} />

      <BlockConfigModal
        visible={isModalOpen}
        block={activeBlock?.id ? activeBlock : null}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlock}
        onDelete={handleDeleteBlock}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
