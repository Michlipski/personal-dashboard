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

From the primary Daily View, users toggle between three view modes:
* **Tab 1: `[ 📅 Schedule & Plan ]`:** The time-anchored schedule and checklist.
* **Tab 2: `[ 💧 Health & Vitals ]`:** The non-time-specific health metrics input dashboard.
* **Tab 3: `[ 📜 Past Reports ]`:** The historical execution archive browser and JSON payload viewer.

---

## 3. Metrics Specification & Visualizations

### 1. Water Intake: Rainbow Spectrum Gradient Bar
* **Measurement:** Increments of 250ml up to a target (default: 3000ml).
* **UI Design & Display (No Mentions of Glasses):**
  - **Top Readout:** Top-left displays current volume (`2,250 ml of 3000 ml`), while top-right cleanly displays only the completion percentage (`75%`).
  - **Flanking Steppers:** Flanked directly to the left and right of the spectrum bar by minimal circular `−` and `+` icon buttons.
  - **Axis Indicators:** Directly beneath the gradient track, a clean axis displays values at `0`, `1500ml`, and `3000ml`.
* **Visualization (The Spectrum Fill):**
  Instead of a generic blue bar or stretched fill, the track utilizes an underlying continuous multi-stop gradient spanning 0 to 3000ml, with a dark opacity filter overtop covering the unreached portion:
  $$\text{Red} \longrightarrow \text{Orange} \longrightarrow \text{Yellow} \longrightarrow \text{White} \longrightarrow \text{Blue} \longrightarrow \text{Indigo}$$
  - `0 - 750ml (Dehydrated)`: Red (`#EF4444`) to Orange (`#F97316`).
  - `750 - 1500ml (Sub-Optimal)`: Orange to Yellow (`#EAB308`).
  - `1500 - 2250ml (Baseline)`: Yellow transitioning through Bright White (`#FFFFFF`).
  - `2250 - 3000ml+ (Optimal Hydration)`: Clean Sky Blue (`#38BDF8`) to Deep Indigo (`#4F46E5`).
  - **Layering Architecture:** The complete spectrum sits as an underlying continuous layer across 100% width of the track. An opacity filter layer (`#1c1d21` at 85% opacity) sits overtop covering the uncompleted portion (`left: ${percentage}%`, `right: 0`), allowing unreached target colors to remain softly perceptible while reached volumes glow at 100% vibrance.

### 2. Energy Level Tracking
* **Measurement:** 3-point capacitive rating ordered left-to-right from depleted to energized:
  - `🔋 Low Energy`: Depleted, ideal for zero-duration habits, light review, or recovery (`#F97316`).
  - `⚖️ Medium Energy`: Stable baseline, suitable for routine tasks and structured work (`#EAB308`).
  - `⚡ High Energy`: Primed for deep technical execution or demanding practice (`#10B981`).

### 3. Mood & Stress Assessment
* **Measurement:** 5-point discrete selector arranged left-to-right from lowest to highest:
  - `😣 Stressed` (`#EF4444`) $\longrightarrow$ `😔 Low` (`#F97316`) $\longrightarrow$ `😐 Neutral` (`#EAB308`) $\longrightarrow$ `🙂 Good` (`#38BDF8`) $\longrightarrow$ `😄 Great` (`#10B981`).
* **Qualitative Note:** Optional single-line reflection input (e.g. *"Slept poorly due to room temperature, but mentally clear"*).

### 4. Screen Time Tracking
* **Measurement:** Manual entry of daily digital consumption in hours and minutes:
  - Total Screen Time (e.g., `5h 30m`).
  - Optional breakdown: Productive / Deep Work Screen Time vs. Leisure / Social Media.

---

## 4. Local Caching Contract

Like the daily schedule, all vitals inputs immediately persist to local client storage (`AsyncStorage` on Native, `localStorage` on Web) under the key `health_metrics_cache_YYYY-MM-DD`:
* Incrementing water or updating energy level updates the cache instantaneously.
* Switching tabs between `Schedule & Plan` and `Daily Health & Vitals` retains state with zero reload latency.

---

## 5. Data Schema & TypeScript Interfaces

```typescript
export type EnergyLevel = 'high' | 'medium' | 'low';

export type MoodRating = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

export interface DailyHealthMetrics {
  date: string; // YYYY-MM-DD
  waterIntake: {
    glasses: number;
    targetGlasses: number;
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
+-----------------------------------------------------------------------------+
|  DAILY EXECUTION ENGINE   WEDNESDAY, SEP 9    [ 📊 Report ] [ ↺ Reset ] [ 🌅 New Day ]
|  [ Schedule & Plan ]    [ (•) Health & Vitals ]                             |
|-----------------------------------------------------------------------------|
|  💧 WATER INTAKE                                                            |
|  2,250 ml of 3000 ml                                                    75% |
|                                                                             |
|  ( - )  [=============================              ]  ( + )                |
|          Red -> Orange -> Yellow -> White -> Blue                           |
|          0                        1500ml                       3000ml       |
|-----------------------------------------------------------------------------|
|  ⚡ ENERGY LEVEL                                                             |
|  [ ( ) 🔋 Low ]          [ (•) ⚖️ Medium ]          [ ( ) ⚡ High ]          |
|-----------------------------------------------------------------------------|
|  🧠 MOOD & STATE                                                            |
|  [ Stressed 😣 ] [ Low 😔 ] [ Neutral 😐 ] [ (•) Good 🙂 ] [ Great 😄 ]     |
|  Notes: [ Morning focus was strong, sustained clarity ]                     |
|-----------------------------------------------------------------------------|
|  📱 SCREEN TIME                                                             |
|  Total: [ 4 ] hrs [ 15 ] mins                                               |
|  • Deep Work: [ 3h 30m ]   • Leisure: [ 0h 45m ]                            |
+-----------------------------------------------------------------------------+
```

---

## 7. Engineering Action Items

1. **Spectrum Gradient Component (`WaterGradientBar.tsx`):** Linear gradient styling mapping progress percentage to color stop transitions (`red -> orange -> yellow -> white -> blue -> indigo`).
2. **Vitals State Store (`useHealthMetricsStore.ts`):** Reactive state with auto-caching to `AsyncStorage`.
3. **Tab Switcher Header (`DailySubTabs.tsx`):** Seamless toggle between schedule list and health vitals view.
4. **Daily Report Linkage:** Export hook bundling current health state into the report generator payload.
