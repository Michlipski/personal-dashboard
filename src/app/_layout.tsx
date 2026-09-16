import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { StorybookViewer } from '@/components/daily/stories/StorybookViewer';

SplashScreen.preventAutoHideAsync();

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK === 'true';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {isStorybook ? (
        <StorybookViewer />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="daily" />
          <Stack.Screen name="storybook" />
        </Stack>
      )}
    </ThemeProvider>
  );
}
