import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Import story components
import * as BlockConfigStories from './BlockConfigModal.stories';
import * as CopyReportStories from './CopyReportButton.stories';
import * as DailyReportStories from './DailyReportModal.stories';
import * as PastReportsStories from './DailyPastReportsScreen.stories';
import * as DailyScreenStories from './DailyScreen.stories';
import * as DailySubTabsStories from './DailySubTabs.stories';
import * as DailyHamburgerMenuStories from './DailyHamburgerMenu.stories';
import { DailyHamburgerMenu } from '../DailyHamburgerMenu';
import * as EnergyStories from './EnergyLevelSelector.stories';
import * as JsonSyntaxStories from './JsonSyntaxViewer.stories';
import * as LeftLaneStories from './LeftLaneDurationBlock.stories';
import * as MoodStories from './MoodRatingCard.stories';
import * as ResetConfirmStories from './ResetConfirmModal.stories';
import * as RightLaneStories from './RightLaneZeroDurationBlock.stories';
import * as ScreenTimeStories from './ScreenTimeInput.stories';
import * as StartNewDayStories from './StartNewDayConfirmModal.stories';
import * as TimelineStories from './Timeline24Hour.stories';
import * as TriStateStories from './TriStateCheckbox.stories';
import * as WaterStories from './WaterGradientBar.stories';

export interface StoryItem {
  id: string;
  category: string;
  component: string;
  storyName: string;
  Component: React.ComponentType;
}

export const STORIES: StoryItem[] = [
  // Primitives
  {
    id: 'primitives-checkbox-interactive',
    category: 'Primitives',
    component: 'TriStateCheckbox',
    storyName: 'Interactive Toggle',
    Component: TriStateStories.Interactive,
  },
  {
    id: 'primitives-checkbox-states',
    category: 'Primitives',
    component: 'TriStateCheckbox',
    storyName: 'All States (Pending / Done / Missed)',
    Component: TriStateStories.AllStates,
  },
  {
    id: 'primitives-subtabs-interactive',
    category: 'Primitives',
    component: 'DailySubTabs',
    storyName: 'Interactive Tab Switcher',
    Component: DailySubTabsStories.Interactive,
  },
  {
    id: 'primitives-hamburger-menu-interactive',
    category: 'Primitives',
    component: 'DailyHamburgerMenu',
    storyName: 'Interactive Drawer & Route Switcher',
    Component: DailyHamburgerMenuStories.Interactive,
  },
  {
    id: 'primitives-reset-modal',
    category: 'Primitives',
    component: 'ResetConfirmModal',
    storyName: 'Confirmation Dialog',
    Component: ResetConfirmStories.Interactive,
  },
  {
    id: 'primitives-start-new-day-modal',
    category: 'Primitives',
    component: 'StartNewDayConfirmModal',
    storyName: 'New Day Rollover Dialog',
    Component: StartNewDayStories.Interactive,
  },

  // Schedule
  {
    id: 'schedule-leftlane-standard',
    category: 'Schedule',
    component: 'LeftLaneDurationBlock',
    storyName: 'Standard Loose Block',
    Component: LeftLaneStories.StandardBlock,
  },
  {
    id: 'schedule-leftlane-strict',
    category: 'Schedule',
    component: 'LeftLaneDurationBlock',
    storyName: 'Strict Appointment',
    Component: LeftLaneStories.StrictAppointment,
  },
  {
    id: 'schedule-rightlane-standard',
    category: 'Schedule',
    component: 'RightLaneZeroDurationBlock',
    storyName: 'Standard Habit Checkpoint',
    Component: RightLaneStories.StandardHabit,
  },
  {
    id: 'schedule-rightlane-displaced',
    category: 'Schedule',
    component: 'RightLaneZeroDurationBlock',
    storyName: 'Displaced with Leader Line',
    Component: RightLaneStories.DisplacedWithLeaderLine,
  },
  {
    id: 'schedule-timeline-default',
    category: 'Schedule',
    component: 'Timeline24Hour',
    storyName: '24-Hour Split Timeline',
    Component: TimelineStories.DefaultTimeline,
  },
  {
    id: 'schedule-modal-edit',
    category: 'Schedule',
    component: 'BlockConfigModal',
    storyName: 'Edit Mode with Recalculation',
    Component: BlockConfigStories.EditMode,
  },
  {
    id: 'schedule-modal-create',
    category: 'Schedule',
    component: 'BlockConfigModal',
    storyName: 'Creation Mode with Smart Defaults',
    Component: BlockConfigStories.CreateMode,
  },

  // Health
  {
    id: 'health-water-interactive',
    category: 'Health',
    component: 'WaterGradientBar',
    storyName: 'Interactive Spectrum Steppers',
    Component: WaterStories.Interactive,
  },
  {
    id: 'health-water-states',
    category: 'Health',
    component: 'WaterGradientBar',
    storyName: 'Spectrum States Overview',
    Component: WaterStories.StatesOverview,
  },
  {
    id: 'health-energy-interactive',
    category: 'Health',
    component: 'EnergyLevelSelector',
    storyName: '3-Point Capacitive Selector',
    Component: EnergyStories.Interactive,
  },
  {
    id: 'health-mood-interactive',
    category: 'Health',
    component: 'MoodRatingCard',
    storyName: '5-Point Mood & Reflection Notes',
    Component: MoodStories.Interactive,
  },
  {
    id: 'health-screentime-interactive',
    category: 'Health',
    component: 'ScreenTimeInput',
    storyName: 'Screen Time & Work/Leisure Splits',
    Component: ScreenTimeStories.Interactive,
  },

  // Report
  {
    id: 'report-syntax-default',
    category: 'Report',
    component: 'JsonSyntaxViewer',
    storyName: 'Monospace Indented Code Block',
    Component: JsonSyntaxStories.DefaultViewer,
  },
  {
    id: 'report-copy-button',
    category: 'Report',
    component: 'CopyReportButton',
    storyName: 'Tactile Clipboard Copy Button',
    Component: CopyReportStories.Interactive,
  },
  {
    id: 'report-modal-interactive',
    category: 'Report',
    component: 'DailyReportModal',
    storyName: 'Full End-of-Day Report Modal',
    Component: DailyReportStories.Interactive,
  },
  {
    id: 'report-past-reports-screen',
    category: 'Report',
    component: 'DailyPastReportsScreen',
    storyName: 'Historical Reports Archive Tab',
    Component: PastReportsStories.Interactive,
  },

  // Full View
  {
    id: 'fullview-daily-screen',
    category: 'Full View',
    component: 'DailyScreen',
    storyName: 'Complete Stage 1 Daily Dashboard',
    Component: DailyScreenStories.DefaultView,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  Primitives: '🧩',
  Schedule: '📅',
  Health: '💧',
  Report: '📊',
  'Full View': '🖥️',
};

export function StorybookViewer() {
  const theme = useTheme();

  // Group stories by category
  const categories = React.useMemo(() => {
    const map = new Map<string, StoryItem[]>();
    STORIES.forEach((story) => {
      const existing = map.get(story.category) || [];
      existing.push(story);
      map.set(story.category, existing);
    });
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, []);

  // Track collapsed/expanded state for each category folder (all open by default)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    Primitives: true,
    Schedule: true,
    Health: true,
    Report: true,
    'Full View': true,
  });

  const [activeStoryId, setActiveStoryId] = useState<string>(STORIES[0].id);

  const activeStory =
    STORIES.find((s) => s.id === activeStoryId) || STORIES[0];
  const ActiveComponent = activeStory.Component;

  const toggleFolder = (category: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    categories.forEach((c) => {
      allOpen[c.category] = true;
    });
    setOpenFolders(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    categories.forEach((c) => {
      allClosed[c.category] = false;
    });
    setOpenFolders(allClosed);
  };

  const selectStory = (story: StoryItem) => {
    setActiveStoryId(story.id);
    // Ensure the parent category folder is expanded
    setOpenFolders((prev) => ({
      ...prev,
      [story.category]: true,
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Storybook Header */}
        <ThemedView type="backgroundElement" style={styles.header}>
          <View style={styles.headerLeftRow}>
            <DailyHamburgerMenu currentRoute="storybook" />
            <View>
              <ThemedText type="smallBold" style={styles.brandTitle}>
                📖 STORYBOOK COMPONENT CATALOG
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Stage 1 Daily • {STORIES.length} Stories across {categories.length} Categories
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <View style={styles.body}>
          {/* Collapsible Sidebar */}
          <ThemedView type="backgroundElement" style={styles.sidebar}>
            {/* Folder Controls */}
            <View style={styles.folderControlsRow}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.foldersTitle}>
                FOLDERS
              </ThemedText>
              <View style={styles.controlButtons}>
                <Pressable onPress={expandAll} style={styles.actionPill}>
                  <ThemedText type="small" style={styles.pillActionText}>
                    Expand
                  </ThemedText>
                </Pressable>
                <Pressable onPress={collapseAll} style={styles.actionPill}>
                  <ThemedText type="small" style={styles.pillActionText}>
                    Collapse
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollList}>
              {categories.map(({ category, items }) => {
                const isOpen = !!openFolders[category];
                const catIcon = CATEGORY_ICONS[category] || '📁';
                const hasActiveChild = items.some((item) => item.id === activeStoryId);

                return (
                  <View key={category} style={styles.categoryFolder}>
                    {/* Collapsible Folder Header */}
                    <Pressable
                      onPress={() => toggleFolder(category)}
                      style={({ pressed }) => [
                        styles.folderHeader,
                        hasActiveChild && styles.folderHeaderActiveChild,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`${category} category, ${items.length} items. ${
                        isOpen ? 'Expanded' : 'Collapsed'
                      }`}
                    >
                      <ThemedText style={styles.chevronIcon}>
                        {isOpen ? '▾' : '▸'}
                      </ThemedText>

                      <ThemedText style={styles.folderGlyph}>
                        {isOpen ? '📂' : '📁'}
                      </ThemedText>

                      <ThemedText
                        type="smallBold"
                        themeColor={hasActiveChild ? 'text' : 'textSecondary'}
                        style={styles.categoryName}
                      >
                        {catIcon} {category}
                      </ThemedText>

                      <View
                        style={[
                          styles.countBadge,
                          { backgroundColor: theme.background },
                        ]}
                      >
                        <ThemedText
                          type="small"
                          themeColor="textSecondary"
                          style={styles.countText}
                        >
                          {items.length}
                        </ThemedText>
                      </View>
                    </Pressable>

                    {/* Collapsible Children List */}
                    {isOpen && (
                      <View style={styles.folderItemsContainer}>
                        {items.map((story) => {
                          const isSelected = activeStoryId === story.id;
                          return (
                            <Pressable
                              key={story.id}
                              onPress={() => selectStory(story)}
                              style={({ pressed }) => [
                                styles.storyRow,
                                isSelected && [
                                  styles.storyRowSelected,
                                  { backgroundColor: theme.background },
                                ],
                                pressed && styles.pressed,
                              ]}
                            >
                              <View
                                style={[
                                  styles.storyBullet,
                                  {
                                    backgroundColor: isSelected
                                      ? '#3B82F6'
                                      : theme.backgroundSelected,
                                  },
                                ]}
                              />
                              <View style={styles.storyTextCol}>
                                <ThemedText
                                  type={isSelected ? 'smallBold' : 'small'}
                                  themeColor={isSelected ? 'text' : 'textSecondary'}
                                  style={styles.componentLabel}
                                >
                                  {story.component}
                                </ThemedText>
                                <ThemedText
                                  type="small"
                                  themeColor={isSelected ? 'text' : 'textSecondary'}
                                  style={styles.storyVariantLabel}
                                >
                                  {story.storyName}
                                </ThemedText>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </ThemedView>

          {/* Story Stage / Canvas */}
          <ThemedView style={styles.canvas}>
            {/* Breadcrumb Header */}
            <View
              style={[
                styles.canvasHeader,
                { borderBottomColor: theme.backgroundSelected },
              ]}
            >
              <View style={styles.breadcrumbRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {activeStory.category}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  /
                </ThemedText>
                <ThemedText type="smallBold">
                  {activeStory.component}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  /
                </ThemedText>
                <ThemedText type="small" style={{ color: '#3B82F6' }}>
                  {activeStory.storyName}
                </ThemedText>
              </View>
            </View>

            {/* Rendered Story */}
            <View style={styles.canvasContent}>
              <ActiveComponent />
            </View>
          </ThemedView>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#33333330',
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 4,
  },
  brandTitle: {
    letterSpacing: 0.5,
    color: '#3B82F6',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 320,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#33333330',
    paddingVertical: Spacing.two,
  },
  folderControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#33333320',
  },
  foldersTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  actionPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#33333320',
  },
  pillActionText: {
    fontSize: 11,
  },
  scrollList: {
    flex: 1,
    paddingTop: Spacing.one,
  },
  categoryFolder: {
    marginBottom: Spacing.one,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one + 2,
    borderRadius: Spacing.one,
  },
  folderHeaderActiveChild: {
    backgroundColor: '#3B82F608',
  },
  chevronIcon: {
    fontSize: 12,
    width: 12,
    color: '#94A3B8',
  },
  folderGlyph: {
    fontSize: 14,
  },
  categoryName: {
    flex: 1,
    fontSize: 13,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
  },
  folderItemsContainer: {
    paddingLeft: Spacing.four + 4,
    paddingRight: Spacing.two,
    paddingTop: 2,
    gap: 2,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one + 2,
    gap: Spacing.two,
  },
  storyRowSelected: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  storyBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  storyTextCol: {
    flex: 1,
    gap: 1,
  },
  componentLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  storyVariantLabel: {
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.8,
  },
  canvas: {
    flex: 1,
  },
  canvasHeader: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  canvasContent: {
    flex: 1,
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.75,
  },
});
