---
title: "Design System & Theming Specification"
category: "product"
lastUpdated: "2026-09-09"
---
# Design System & Theming Specification

**Document Purpose:** Defines the visual tokens, domain palettes, pacing states, and specialized visualization components for the Personal Productivity Engine.

---

## 1. Core Design Principles

1. **Information Density with Breathing Room:** Multi-horizon planning requires dense data (pace curves, capacity budgets, streaks), but screen layouts must feel calm and uncluttered using consistent spacing.
2. **Semantic Status Colors:** Colors convey mathematical pace and capacity states—not arbitrary decorations.
3. **Tactile Interaction:** Quick-log steppers, horizon segment switches, and suggestion action triggers must provide immediate visual/haptic feedback.

---

## 2. Design Token Architecture

### Base Theme Tokens (`src/constants/theme.ts`)

| Token | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `text` | `#000000` | `#ffffff` | Primary headers, active titles |
| `background` | `#ffffff` | `#000000` | Canvas and screen container |
| `backgroundElement` | `#F0F0F3` | `#212225` | Card surfaces, capacity containers |
| `backgroundSelected` | `#E0E1E6` | `#2E3135` | Active tab triggers, pressed items |
| `textSecondary` | `#60646C` | `#B0B4BA` | Subtitles, pace labels, secondary text |

### Life Domain Color Palette

| Domain | Hex Code | Visual Semantic |
| :--- | :--- | :--- |
| `craft` (e.g. Piano, Writing) | `#F59E0B` (Amber) | Mastery, creativity, sustained practice |
| `career` (e.g. Software, Systems) | `#3B82F6` (Blue) | Professional output, technical execution |
| `health` (e.g. Running, Sleep) | `#10B981` (Emerald) | Physical vitality, biological recovery |
| `wealth` (e.g. Investing, Savings) | `#8B5CF6` (Violet) | Capital accumulation, long-term security |
| `personal` (e.g. Family, Reading) | `#EC4899` (Pink/Rose) | Relational depth, personal restoration |

### Status & Pacing Tokens

| State | Hex Code | Meaning |
| :--- | :--- | :--- |
| `on_track` | `#10B981` | Pace is within ±10% of milestone timeline |
| `ahead_of_pace` | `#06B6D4` | Logged hours/progress exceed expected pace |
| `at_risk` | `#F59E0B` | Milestone pace deficit detected (>15% behind) |
| `stalled` | `#EF4444` | Zero hours logged for >10 days |
| `re_entry` | `#8B5CF6` | Post-break icebreaker mode active |

---

## 3. Specialized Visualization Components

### 1. `CapacityGauge`
* **Purpose:** Visualizes finite weekly and daily capacity.
* **Layout:** Segmented or layered horizontal bar showing:
  - *Logged Hours (Solid fill)*
  - *Remaining Budget (Light track fill)*
  - *Overcommitment Spillover (Red cross-hatch if allocated > budget)*
* **Text Readout:** `18.5h / 25h Logged • 6.5h Remaining`.

### 2. `PaceLineChart`
* **Purpose:** Visualizes progress against the Strides-style expected pace line.
* **Elements:**
  - Target Trajectory Line (Dashed linear slope from start date to target date).
  - Actual Logged Trajectory Line (Solid stepped line based on `DailyLogEntry`).
  - Gap Indicator Pill: Shows `+2.0h ahead` (Teal) or `-1.5h behind` (Amber).

### 3. `StreakBadge`
* **Purpose:** Displays momentum state with context-dependent visual styles:
  - `Forming (<10d)`: Soft subtle border, gentle flame icon (`🔥 4d`).
  - `High Momentum (>=10d)`: Intense glowing border, pulsing flame (`🔥 14d [High Momentum]`).
  - `Re-Entry Mode`: Violet recovery shield badge (`🛡️ Re-Entry: 10m Icebreaker`).

### 4. `SuggestionCard`
* **Purpose:** Presents deterministic recommendations clearly.
* **Layout:** Card with left-accent border matching priority:
  - Red accent: High priority (Re-entry / Stalled objective).
  - Amber accent: Medium priority (Pace lag).
  - Blue accent: Low priority (Optimization / Rebalancing).
* **Action:** Direct inline button (e.g. `[ Schedule 10m Icebreaker ]` or `[ Adjust Milestone Date ]`).

### 5. `DailyLogModal`
* **Purpose:** Rapid execution logging (<60s) with live capacity burndown.
* **Elements:**
  - Objective / Milestone selector.
  - Hour stepper control (`- 0.5h +`).
  - 3-choice energy pills: `High ⚡`, `Medium ⚖️`, `Low 🔋`.
  - Dynamic Capacity Impact Preview: `Remaining Today: 3.5h -> 2.0h`.
