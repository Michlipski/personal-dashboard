---
title: "Technical Specification: Health Metrics Service (Stage 1)"
category: "technical-documentation"
stage: "stage-1"
lastUpdated: "2026-09-09"
---
# Technical Specification: Health Metrics Service (Stage 1)

## 1. System Overview & Architectural Role

The **Health Metrics Service** governs the non-time-specific daily inputs (hydration, energy, mood, screen time). It operates alongside the schedule checklist, maintaining a synchronized daily vitals state that persists locally and feeds into the daily report generator.

```mermaid
graph TD
    UserTap[User Tap / Input] --> HealthComponents[Health UI: Water, Energy, Mood, ScreenTime]
    HealthComponents --> Store[Zustand Store: useHealthMetricsStore]
    Store --> GradientCalc[Rainbow Gradient Engine]
    Store --> Cache[Client Storage: AsyncStorage / localStorage]
    Store --> DailyReport[Bundled into Daily Report Payload]
```

---

## 2. Component Architecture & Hierarchy

```
src/components/health/
├── DailyHealthScreen.tsx             # Parent view container for all daily vitals
├── DailySubTabs.tsx                  # Top sub-navigation bar (Schedule vs Vitals)
├── WaterGradientBar.tsx              # Rainbow spectrum hydration gradient visualizer
├── EnergyLevelSelector.tsx           # Segmented 3-point capacitive rating pills
├── MoodRatingCard.tsx                # 5-choice mood selector with qualitative text input
└── ScreenTimeInput.tsx               # Numerical hour & minute steppers with categorization
```

### Component Breakdown

1. **`DailyHealthScreen`:**
   - Mounts under the `Daily` route when the active sub-tab is set to `'vitals'`.
   - Organizes metrics vertically using tokenized padding (`Spacing.four`).
2. **`DailySubTabs`:**
   - Floating pill toggle using `ThemedView` and `ThemedText`.
   - Dispatches tab switch between `'schedule'` and `'vitals'`.
3. **`WaterGradientBar`:**
   - Displays glass count (e.g. `6 of 8 Glasses • 75%`).
   - Renders a multi-stop horizontal gradient bar that fills dynamically.
   - Steppers `[ - ]` and `[ + ]` update state in 1-glass (250ml) increments.
4. **`EnergyLevelSelector`:**
   - Segmented radio pills for `high`, `medium`, `low` with visual icon accents (`⚡`, `⚖️`, `🔋`).
5. **`MoodRatingCard`:**
   - 5-item horizontal pill selector (`Great`, `Good`, `Neutral`, `Low`, `Stressed`).
   - Text input for optional notes with debounced auto-save.
6. **`ScreenTimeInput`:**
   - Form inputs for total screen time and optional deep work / leisure splits.

---

## 3. Rainbow Spectrum Gradient Engine

The water intake fill bar utilizes a dynamic linear gradient reflecting hydration state across 6 distinct color stops:

$$\text{Red } (\#EF4444) \longrightarrow \text{Orange } (\#F97316) \longrightarrow \text{Yellow } (\#EAB308) \longrightarrow \text{White } (\#FFFFFF) \longrightarrow \text{Sky Blue } (\#38BDF8) \longrightarrow \text{Deep Indigo } (\#4F46E5)$$

### Mathematical Color Stop Definition

The full gradient spans the domain $[0, 100\%]$. The fill width is calculated as:
$$W_{\text{fill}} = \min\left( \frac{\text{currentGlasses}}{\text{targetGlasses}} \times 100\%, 100\% \right)$$

To render the gradient correctly inside the fill container, the SVG or linear gradient applies the following color stops:

```typescript
export const WATER_GRADIENT_STOPS = [
  { offset: '0%', color: '#EF4444' },   // Red (0-1 glass)
  { offset: '20%', color: '#F97316' },  // Orange (2 glasses)
  { offset: '40%', color: '#EAB308' },  // Yellow (3-4 glasses)
  { offset: '60%', color: '#FFFFFF' },  // White baseline (5 glasses)
  { offset: '80%', color: '#38BDF8' },  // Sky Blue (6-7 glasses)
  { offset: '100%', color: '#4F46E5' }, // Deep Indigo (8+ glasses)
] as const;
```

### React Native & Web SVG Implementation
```tsx
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface WaterGradientBarProps {
  currentGlasses: number;
  targetGlasses: number;
  width: number;
  height?: number;
}

export const WaterGradientBar: React.FC<WaterGradientBarProps> = ({
  currentGlasses,
  targetGlasses,
  width,
  height = 24,
}) => {
  const percentage = Math.min(Math.max(currentGlasses / targetGlasses, 0), 1);
  const fillWidth = width * percentage;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="waterRainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {WATER_GRADIENT_STOPS.map((stop, idx) => (
            <Stop key={idx} offset={stop.offset} stopColor={stop.color} />
          ))}
        </LinearGradient>
      </Defs>
      {/* Background Track */}
      <Rect x={0} y={0} width={width} height={height} rx={height / 2} fill="#212225" />
      {/* Dynamic Rainbow Fill */}
      <Rect
        x={0}
        y={0}
        width={fillWidth}
        height={height}
        rx={height / 2}
        fill="url(#waterRainbowGradient)"
      />
    </Svg>
  );
};
```

---

## 4. State Management Contract (`useHealthMetricsStore.ts`)

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyHealthMetrics, EnergyLevel, MoodRating } from '@/types/health';

interface HealthMetricsStoreState {
  selectedDate: string;
  metrics: DailyHealthMetrics;
  isLoading: boolean;

  // Actions
  setDate: (date: string) => Promise<void>;
  addWaterGlass: () => Promise<void>;
  removeWaterGlass: () => Promise<void>;
  setEnergyLevel: (level: EnergyLevel) => Promise<void>;
  setMood: (mood: MoodRating, notes?: string) => Promise<void>;
  setScreenTime: (totalMinutes: number, productiveMinutes?: number, leisureMinutes?: number) => Promise<void>;
  loadCachedMetrics: (date: string) => Promise<void>;
}

const DEFAULT_METRICS: DailyHealthMetrics = {
  date: '',
  waterIntake: { glasses: 0, targetGlasses: 8, milliliters: 0, percentageOfTarget: 0 },
  energyLevel: 'medium',
  mood: 'good',
  screenTime: { totalMinutes: 0 },
  lastUpdated: new Date().toISOString(),
};

export const useHealthMetricsStore = create<HealthMetricsStoreState>((set, get) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  metrics: { ...DEFAULT_METRICS, date: new Date().toISOString().split('T')[0] },
  isLoading: false,

  setDate: async (date) => {
    set({ selectedDate: date });
    await get().loadCachedMetrics(date);
  },

  addWaterGlass: async () => {
    const current = get().metrics.waterIntake.glasses;
    const target = get().metrics.waterIntake.targetGlasses;
    const next = current + 1;
    
    const updatedMetrics: DailyHealthMetrics = {
      ...get().metrics,
      waterIntake: {
        glasses: next,
        targetGlasses: target,
        milliliters: next * 250,
        percentageOfTarget: next / target,
      },
      lastUpdated: new Date().toISOString(),
    };

    set({ metrics: updatedMetrics });
    await AsyncStorage.setItem(
      `health_metrics_cache_${get().selectedDate}`,
      JSON.stringify(updatedMetrics)
    );
  },

  setEnergyLevel: async (level) => {
    const updated = { ...get().metrics, energyLevel: level, lastUpdated: new Date().toISOString() };
    set({ metrics: updated });
    await AsyncStorage.setItem(`health_metrics_cache_${get().selectedDate}`, JSON.stringify(updated));
  },

  loadCachedMetrics: async (date) => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(`health_metrics_cache_${date}`);
      if (raw) {
        set({ metrics: JSON.parse(raw) });
      } else {
        set({ metrics: { ...DEFAULT_METRICS, date } });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
```

---

## 5. Cross-Platform Considerations

* **Hydration Safety on Web:** `AsyncStorage` falls back to `localStorage` on web via the standard Expo polyfill. `loadCachedMetrics` executes inside `useEffect` on component mount to prevent server/client markup mismatches.
* **SVG Gradient Defs:** Unique SVG `id="waterRainbowGradient"` ensures that multiple gradient instances or re-renders do not conflict in the DOM.
