---
title: "Expo Client Service & Routing Architecture"
category: "technical-documentation"
lastUpdated: "2026-09-09"
---
# Expo Client Service & Routing Architecture

## 1. Component Overview
The Expo Client Service encapsulates the frontend universal application. It manages routing, navigation state, animated splash screens, and design token integration.

## 2. Tech Stack & Packages
* **Framework:** Expo SDK 57 (`~57.0.6`)
* **React Core:** React `19.2.3`, React DOM `19.2.3`, React Native `0.86.0`, React Native Web `~0.21.0`
* **Routing:** `expo-router` `~57.0.6` (Configured with `typedRoutes: true`, `reactCompiler: true` in `app.json`)
* **Animations:** `react-native-reanimated` (`4.5.0`), `react-native-worklets` (`0.10.0`)
* **Package Manager:** Yarn (`.yarnrc.yml` using `nodeLinker: node-modules`)

---

## 3. Directory Layout & Module Responsibilities

```
src/
├── app/                              # Route-level screens (file-based routing)
│   ├── _layout.tsx                   # App root provider: ThemeProvider + Splash
│   ├── index.tsx                     # Route: / (Redirects to /daily)
│   ├── daily.tsx                     # Route: /daily (Daily dashboard)
│   └── storybook.tsx                 # Route: /storybook (Storybook component viewer)
├── components/                       # Shared UI components
│   ├── daily/                        # Stage 1 Daily dashboard components & stores
│   ├── ui/                           # Primitive composite elements (Collapsible)
│   ├── animated-icon.*               # Worklet-driven splash overlay
│   ├── app-tabs.*                    # Platform-adaptive navigation bar (Daily, Storybook)
│   ├── external-link.tsx             # External URL opener primitive
│   ├── themed-text.tsx               # Theme-aware text primitive
│   └── themed-view.tsx               # Theme-aware container primitive
├── constants/                        # Global immutable design tokens
│   └── theme.ts                      # Color maps, Spacing scales, Fonts
├── hooks/                            # Custom hooks
│   ├── use-color-scheme.*            # Hydration-safe scheme detection
│   └── use-theme.ts                  # Active color resolution hook
└── global.css                        # CSS variable bindings for web typography
```

---

## 4. Routing & State Flow

1. **Root Layout (`src/app/_layout.tsx`):**
   ```tsx
   export default function TabLayout() {
     const colorScheme = useColorScheme();
     return (
       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
         <AnimatedSplashOverlay />
         {isStorybook ? <StorybookViewer /> : <AppTabs />}
       </ThemeProvider>
     );
   }
   ```
2. **Navigation Triggers:**
   * Root `/` automatically redirects to `/daily`.
   * Tabs link to `/daily` (`DailyScreen`) and `/storybook` (`StorybookViewer`).
   * Adding new routes requires creating files inside `src/app/` (e.g. `src/app/settings.tsx`), automatically generating typed route definitions.
