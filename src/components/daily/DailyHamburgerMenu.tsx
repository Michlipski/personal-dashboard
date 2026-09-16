import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DailyTabMode } from './types';

export interface DailyHamburgerMenuProps {
  activeTab?: DailyTabMode;
  onChangeTab?: (tab: DailyTabMode) => void;
  currentRoute?: 'daily' | 'storybook';
}

interface TabOption {
  key: DailyTabMode;
  icon: string;
  title: string;
  description: string;
}

const TAB_OPTIONS: TabOption[] = [
  {
    key: 'schedule',
    icon: '📅',
    title: 'Schedule & Plan',
    description: '24-hour split timeline & task checklist',
  },
  {
    key: 'vitals',
    icon: '💧',
    title: 'Health & Vitals',
    description: 'Water intake, capacitive energy & mood rating',
  },
  {
    key: 'reports',
    icon: '📜',
    title: 'Past Reports',
    description: 'Archived daily snapshots & completion metrics',
  },
];

export function DailyHamburgerMenu({
  activeTab = 'schedule',
  onChangeTab,
  currentRoute = 'daily',
}: DailyHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const handleSelectTab = (tab: DailyTabMode) => {
    if (currentRoute !== 'daily') {
      router.push('/daily' as any);
    }
    onChangeTab?.(tab);
    setIsOpen(false);
  };

  const handleNavigate = (route: 'daily' | 'storybook') => {
    setIsOpen(false);
    if (route === 'daily') {
      router.push('/daily' as any);
    } else if (route === 'storybook') {
      router.push('/storybook' as any);
    }
  };

  const iconBarColor = theme.text;

  return (
    <>
      {/* Hamburger Trigger Button */}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.triggerButton,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Navigation menu"
        accessibilityHint="Opens navigation menu for tabs and dashboard sections"
      >
        <View style={styles.hamburgerIcon}>
          <View style={[styles.bar, { backgroundColor: iconBarColor }]} />
          <View style={[styles.bar, { backgroundColor: iconBarColor }]} />
          <View style={[styles.bar, { backgroundColor: iconBarColor }]} />
        </View>
      </Pressable>

      {/* Drawer Menu Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalRoot}>
          {/* Slide-in Drawer Container */}
          <ThemedView style={styles.drawerContainer}>
            <SafeAreaView style={styles.drawerSafeArea} edges={['top', 'bottom', 'left']}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.brandRow}>
                  <ThemedText type="smallBold" style={styles.drawerBrandText}>
                    MENU
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setIsOpen(false)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                >
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.closeIconText}>
                    ✕
                  </ThemedText>
                </Pressable>
              </View>

              <ScrollView
                style={styles.drawerScroll}
                contentContainerStyle={styles.drawerScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* SECTION 1: Daily Sub-tabs */}
                <View style={styles.sectionHeader}>
                  <ThemedText
                    type="smallBold"
                    themeColor="textSecondary"
                    style={styles.sectionLabel}
                  >
                    DAILY VIEWS
                  </ThemedText>
                </View>

                <View style={styles.menuItemsList}>
                  {TAB_OPTIONS.map((item) => {
                    const isSelected = currentRoute === 'daily' && activeTab === item.key;
                    return (
                      <Pressable
                        key={item.key}
                        onPress={() => handleSelectTab(item.key)}
                        style={({ pressed }) => [
                          styles.menuItem,
                          isSelected && [
                            styles.menuItemSelected,
                            { backgroundColor: theme.backgroundSelected },
                          ],
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.title} tab. ${isSelected ? 'Selected' : ''}`}
                      >
                        <View style={styles.itemIconContainer}>
                          <ThemedText style={styles.itemIcon}>{item.icon}</ThemedText>
                        </View>
                        <View style={styles.itemTextCol}>
                          <ThemedText
                            type="smallBold"
                            themeColor={isSelected ? 'text' : 'textSecondary'}
                            style={styles.itemTitle}
                          >
                            {item.title}
                          </ThemedText>
                          <ThemedText
                            type="small"
                            themeColor="textSecondary"
                            style={styles.itemDescription}
                          >
                            {item.description}
                          </ThemedText>
                        </View>
                        {isSelected && (
                          <View style={styles.activeCheck}>
                            <ThemedText style={styles.checkText}>✓</ThemedText>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Divider */}
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                />

                {/* SECTION 2: Navigation / App Modules */}
                <View style={styles.sectionHeader}>
                  <ThemedText
                    type="smallBold"
                    themeColor="textSecondary"
                    style={styles.sectionLabel}
                  >
                    NAVIGATION
                  </ThemedText>
                </View>

                <View style={styles.menuItemsList}>
                  {/* Daily Dashboard Route */}
                  <Pressable
                    onPress={() => handleNavigate('daily')}
                    style={({ pressed }) => [
                      styles.menuItem,
                      currentRoute === 'daily' && [
                        styles.menuItemSelected,
                        { backgroundColor: theme.backgroundSelected },
                      ],
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Daily Dashboard route"
                  >
                    <View style={styles.itemIconContainer}>
                      <ThemedText style={styles.itemIcon}>🏠</ThemedText>
                    </View>
                    <View style={styles.itemTextCol}>
                      <ThemedText
                        type="smallBold"
                        themeColor={currentRoute === 'daily' ? 'text' : 'textSecondary'}
                        style={styles.itemTitle}
                      >
                        Daily Dashboard
                      </ThemedText>
                      <ThemedText
                        type="small"
                        themeColor="textSecondary"
                        style={styles.itemDescription}
                      >
                        Main daily timeline and health vitals
                      </ThemedText>
                    </View>
                    {currentRoute === 'daily' && (
                      <View style={styles.activeCheck}>
                        <ThemedText style={styles.checkText}>✓</ThemedText>
                      </View>
                    )}
                  </Pressable>

                  {/* Storybook Route */}
                  <Pressable
                    onPress={() => handleNavigate('storybook')}
                    style={({ pressed }) => [
                      styles.menuItem,
                      currentRoute === 'storybook' && [
                        styles.menuItemSelected,
                        { backgroundColor: theme.backgroundSelected },
                      ],
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Storybook Component Catalog route"
                  >
                    <View style={styles.itemIconContainer}>
                      <ThemedText style={styles.itemIcon}>📖</ThemedText>
                    </View>
                    <View style={styles.itemTextCol}>
                      <ThemedText
                        type="smallBold"
                        themeColor={currentRoute === 'storybook' ? 'text' : 'textSecondary'}
                        style={styles.itemTitle}
                      >
                        Storybook Catalog
                      </ThemedText>
                      <ThemedText
                        type="small"
                        themeColor="textSecondary"
                        style={styles.itemDescription}
                      >
                        Isolated component explorer & stories
                      </ThemedText>
                    </View>
                    {currentRoute === 'storybook' && (
                      <View style={styles.activeCheck}>
                        <ThemedText style={styles.checkText}>✓</ThemedText>
                      </View>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            </SafeAreaView>
          </ThemedView>

          {/* Backdrop Click Dismiss */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setIsOpen(false)}
            accessibilityLabel="Close menu backdrop"
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    width: 38,
    height: 38,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  bar: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  drawerContainer: {
    width: 320,
    maxWidth: '85%',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  drawerSafeArea: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#88888830',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  drawerBrandText: {
    letterSpacing: 1.5,
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
  },
  closeIconText: {
    fontSize: 16,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  menuItemsList: {
    gap: Spacing.one,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
  menuItemSelected: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  itemIconContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    fontSize: 20,
  },
  itemTextCol: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
  },
  itemDescription: {
    fontSize: 11,
    lineHeight: 14,
  },
  activeCheck: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
    marginHorizontal: Spacing.two,
  },
  backdrop: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
