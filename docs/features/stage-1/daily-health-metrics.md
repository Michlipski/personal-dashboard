---
title: "Feature Specification: Daily Health & Vitals Tracking"
category: "features"
stage: "stage-1"
lastUpdated: "2026-09-09"
---
# Feature Specification: Daily Health & Vitals Tracking

## 1. Overview and Objective
The Daily Health & Vitals module provides a dedicated, non-time-specific input surface for tracking biological and lifestyle metrics throughout the day—including water intake, energy levels, mood/stress, and screen time.

**The Problem:** Daily productivity is deeply constrained by physiological energy and hydration, but calendar tools treat human energy as an infinite, static resource.
**The Solution:** A friction-free vitals tracking view accessible via a top tab from the Daily View. Metrics are cached locally and bundled into the Daily Report to uncover correlations between physical habits and objective completion velocity.

---

## 2. Navigation & View Switching

From the primary Daily View, users toggle between two view modes:
* **Tab 1: `[ Schedule & Plan ]`:** The time-anchored schedule and checklist.
* **Tab 2: `[ Daily Health & Vitals ]`:** The non-time-specific health metrics input dashboard.

---

## 3. Metrics Specification & Visualizations

### 1. Water Intake: Rainbow Spectrum Gradient Bar
* **Measurement:** Increments of 1 glass (`250ml`) up to a target (default: 3000ml).
* **Visualization (The Spectrum Fill):**
  Instead of a generic blue bar, the fill level utilizes a rich continuous dynamic gradient representing hydration progression:
  $$\text{Red} \longrightarrow \text{Orange} \longrightarrow \text{Yellow} \longrightarrow \text{White} \longrightarrow \text{Blue} \longrightarrow \text{Indigo}$$
  - `0 - 3 Glasses (Dehydrated)`: Red (`#EF4444`) to Orange (`#F97316`).
  - `4 - 6 Glasses (Sub-Optimal)`: Orange to Yellow (`#EAB308`).
  - `7 - 9 Glasses (Baseline)`: Yellow transitioning through Bright White (`#FFFFFF`).
  - `10 - 12+å Glasses (Optimal Hydration)`: Clean Sky Blue (`#38BDF8`) to Deep Indigo (`#4F46E5`).
* **Controls:** Quick `[ - ]` and `[ + ]` glass steppers alongside tap-to-set fill targets.

### 2. Energy Level Tracking
* **Measurement:** 3-point energy rating capturing current physical capacity:
  - `⚡ High Energy`: Primed for deep technical execution or demanding practice.
  - `⚖️ Medium Energy`: Stable baseline, suitable for routine tasks and structured work.
  - `🔋 Low Energy`: Depleted, ideal for zero-duration habits, light review, or recovery.

### 3. Mood & Stress Assessment
* **Measurement:** 5-point discrete selector (`Great`, `Good`, `Neutral`, `Low`, `Stressed`).
* **Qualitative Note:** Optional single-line reflection input (e.g. *"Slept poorly due to room temperature, but mentally clear"*).

### 4. Screen Time Tracking
* **Measurement:** Manual entry of daily digital consumption in hours and minutes:
  - Total Screen Time (e.g., `5h 30m`).
  - Optional breakdown: Productive / Deep Work Screen Time vs. Leisure / Social Media.

---

## 4. Local Caching Contract

Like the daily schedule, all vitals inputs immediately persist to local client storage (`AsyncStorage` on Native, `localStorage` on Web) under the key `health_metrics_cache_YYYY-MM-DD`:
* Adding a glass of water or updating energy level updates the cache instantaneously.
* Switching tabs between `Schedule & Plan` and `Daily Health & Vitals` retains state with zero reload latency.

---

## 5. Data Schema & TypeScript Interfaces

```typescript
export type EnergyLevel = 'high' | 'medium' | 'low';

export type MoodRating = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

export interface DailyHealthMetrics {
  date: string; // YYYY-MM-DD
  waterIntake: {
    milliliters: number;   // Calculated: glasses * 250
    percentageOfTarget: number;
  };
  energyLevel: EnergyLevel;
  mood: MoodRating;
  moodNotes?: string;
  screenTime: {
    totalMinutes: number;
    productiveMinutes?: number;
    leisureMinutes?: number;
  };
  lastUpdated: string; // ISO timestamp
}
```

---

## 6. UI & Screen Layout

### ASCII Wireframe: Daily Health & Vitals View
```
+-------------------------------------------------------+
|  DAILY VIEW: WEDNESDAY, SEP 9           [ Generate Report ]
|  [ Daily Schedule ]    [ (•) Daily Health & Vitals ]  |
|-------------------------------------------------------|
|  💧 WATER INTAKE                                      |
|  2,250 ml of 3000 ml • 75% of Target            |
|                                                       |
|  [==========================              ]           |
|   Red -> Orange -> Yellow -> White -> Blue -> Indigo   |
|                                                       |
|  [ - Remove Glass ]               [ + Add Glass (250ml)]
|-------------------------------------------------------|
|  ⚡ ENERGY LEVEL                                       |
|  ( ) High ⚡       (•) Medium ⚖️       ( ) Low 🔋      |
|-------------------------------------------------------|
|  🧠 MOOD & STATE                                      |
|  [ Great ]  [(•) Good ]  [ Neutral ]  [ Low ]  [ Stress]
|  Notes: [ Morning focus was strong, hit wall at 3pm ] |
|-------------------------------------------------------|
|  📱 SCREEN TIME                                       |
|  Total: [ 4 ] hrs [ 15 ] mins                         |
|  • Deep Work: [ 3h 30m ]   • Leisure: [ 0h 45m ]      |
+-------------------------------------------------------+
```

---

## 7. Engineering Action Items

1. **Spectrum Gradient Component (`WaterGradientBar.tsx`):** Linear gradient styling mapping progress percentage to color stop transitions (`red -> orange -> yellow -> white -> blue -> indigo`).
2. **Vitals State Store (`useHealthMetricsStore.ts`):** Reactive state with auto-caching to `AsyncStorage`.
3. **Tab Switcher Header (`DailySubTabs.tsx`):** Seamless toggle between schedule list and health vitals view.
4. **Daily Report Linkage:** Export hook bundling current health state into the report generator payload.
