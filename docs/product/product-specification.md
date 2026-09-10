---
title: "Product Specification: Personal Productivity Engine"
category: "product"
lastUpdated: "2026-09-09"
---
# Product Specification: Personal Productivity Engine

## 1. Executive Summary
Personal Productivity Engine is an opinionated, single-user system designed to maximize objective achievement through **multi-horizon visibility**, **predictive planning suggestions**, **closed-loop review rituals**, and **capacity diagnostics**.

Built on Expo SDK 57 and React Native for universal execution (Desktop Web, iOS, Android), the application enforces strict alignment between daily execution (hours logged) and long-term objectives (quarterly milestones and annual North Stars).

---

## 2. Core Functional Pillars

### Pillar 1: Multi-Horizon Objective Visibility
The system tracks objectives across three time horizons:
1. **Short-Term (Daily / Weekly):** Time allocation, active habit streaks, and task completion velocity.
2. **Medium-Term (Monthly / Quarterly):** Explicit milestone deliverables and **Pace Line Trajectories** (tracking whether milestone completion pace is ahead or behind target).
3. **Long-Term (Annual / Multi-Year):** North Star objectives organized by Life Domain (Craft, Career, Health, Wealth, Personal).
4. **Dual Perspectives:**
   - **Per-Goal View:** Deep-dive into time logged, milestone breakdown, pace curve, and streak health for a specific objective.
   - **Macro Productivity Index (PI):** A composite score (0–100) reflecting consistency, deadline adherence, and domain balance across all objectives.

### Pillar 2: Predictive Planning Suggestions (Deterministic Rules Engine)
An offline-capable heuristic rules engine analyzes time budgets, pace lines, and activity deltas to generate actionable suggestion cards across all three horizons:
* **Short-Term Suggestions:** High-Impact 3 daily focus blocks sized to fit remaining daily capacity.
* **Medium-Term Suggestions:** Pacing warnings when a milestone is falling behind schedule, with suggested hour re-allocations.
* **Long-Term Suggestions:** Domain deficit alerts when an objective has been starved of attention for >10 days.

### Pillar 3: Closed-Loop Cadence Rituals
* **Daily Logging & Capacity Reflection:** Users record what actually got done each day (e.g. 1.5 hours practicing piano page 1). Each entry **immediately updates both historical metrics and remaining weekly capacity**.
* **Morning Calibration (2 mins):** User reviews and confirms planned focus blocks against available daily hours.
* **Weekly Retrospective (User as Coach):** The user acts as their own coach in a structured weekly session. The system surfaces pacing data, capacity burnout/surplus, and streak status; the user evaluates performance and commits to next week's horizon allocations.

### Pillar 4: Capacity & Friction Diagnostics
* **Finite Capacity Budgeting:** Models personal focus time as a hard ceiling (e.g., 25 discretionary deep-work hours/week). Overbooking triggers an **Overcommitment Diagnostic**.
* **Asymmetric Momentum & Streak Physics:**
  - **Formation Phase (<10 days):** Encourages early momentum with forgiving penalties for missed days.
  - **High-Momentum Phase (>10 days):** Enforces high accountability with severe streak penalties for unexcused misses once a routine is established (e.g., practicing every day except once in two weeks).
  - **Re-Entry Mode (Post-Vacation/Break):** If returning after a break or illness, the system avoids demotivating streak wipeouts. Instead, it offers a **Re-Entry Protocol**:
    1. Schedules a low-friction **"Icebreaker Block"** (e.g. 5–10 minutes) to break through initial inertia.
    2. Follows up with a standard focus block later in the day.
    3. Completing both restores the streak and returns the goal to active momentum.

---

## 3. Data Schema & Architecture

```typescript
// Core Life Domains
export type LifeDomain = 'growth' | 'career' | 'health' | 'relationships';

// Time Horizons
export type Horizon = 'short_term' | 'medium_term' | 'long_term';

// Goal Status
export type GoalStatus = 'on_track' | 'ahead_of_pace' | 'at_risk' | 'stalled' | 'completed';

// Explicit Milestone (e.g., "Learn page 1 of Chopin Nocturne")
export interface Milestone {
  id: string;
  objectiveId: string;
  title: string;
  targetDate: string; // ISO 8601
  completedDate?: string;
  targetHours: number;
  loggedHours: number;
  isCompleted: boolean;
}

// Momentum & Streak State
export interface StreakState {
  currentStreakDays: number;
  bestStreakDays: number;
  lastLoggedDate: string; // ISO 8601
  state: 'forming' | 'established' | 'at_risk' | 're_entry';
  daysActiveLastTwoWeeks: number; // Evaluates momentum threshold (e.g. 13/14 days)
  inReEntryMode: boolean;
  icebreakerCompleted: boolean;
}

// Explicit Objective (Long-Term / Medium-Term Goal)
export interface Objective {
  id: string;
  title: string;
  domain: LifeDomain;
  horizon: Horizon;
  description?: string;
  targetHoursWeekly: number;
  totalTargetHours?: number;
  totalLoggedHours: number;
  status: GoalStatus;
  milestones: Milestone[];
  streak: StreakState;
  createdAt: string;
}

// Daily Execution Log Entry (Logs reality and reflects onto capacity)
export interface DailyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  objectiveId: string;
  milestoneId?: string;
  hoursSpent: number;
  summary: string;
  feltEnergy: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Personal Capacity Model
export interface CapacityModel {
  weeklyBudgetHours: number;      // e.g. 25 hours
  dailyBudgetHours: number;       // e.g. 4.5 hours on weekdays, 2 hours on weekends
  allocatedHoursThisWeek: number; // Scheduled focus blocks
  loggedHoursThisWeek: number;    // Actually completed from DailyLogEntry
  remainingCapacityThisWeek: number; // weeklyBudgetHours - loggedHoursThisWeek
  overcommitmentAlert: boolean;
}

// Planning Suggestion Item
export interface PlanningSuggestion {
  id: string;
  horizon: Horizon;
  objectiveId: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  rationale: string;
  suggestedAction: 'schedule_focus_block' | 'regularly_scheduled_block' | 'schedule_icebreaker' | 'rebalance_milestone' | 'pause_goal' | 'retrospective';
  suggestedHours?: number;
  suggestedTime?: string; // ISO 8601 datetime
}
```

---

## 4. Screen Inventory & Wireframes

### Wireframe 1: Multi-Horizon Dashboard (Home)
```
+-------------------------------------------------------+
|  [PI: 88/100]  PERSONAL PRODUCTIVITY ENGINE  [Week 37] |
|-------------------------------------------------------|
|  CAPACITY: 18.5h / 25h Logged [====---] 6.5h Remain   |
|                                                       |
|  [ Short-Term ]    [ Medium-Term ]    [ Long-Term ]   |
|-------------------------------------------------------|
|  💡 PLANNING SUGGESTIONS (2)                          |
|  • [HIGH] Piano Piece: Re-Entry Mode Active           |
|    "Returning from trip. 10m Icebreaker recommended"  |
|    [ Schedule 10m Icebreaker ]                        |
|  • [MED] Health: Running Pace Falling Behind          |
|    "Pace line deficit: 4.5km behind weekly target"    |
|                                                       |
|  ACTIVE OBJECTIVES & MOMENTUM                         |
|  🎹 Piano: Chopin Op. 9 No. 2                         |
|     Milestone: Learn Page 1 (3.5h / 6h)               |
|     Pace: On Track  •  Streak: 12d [High Momentum]    |
|                                                       |
|  🦀 Rust Systems Engine                               |
|     Milestone: Implement Raft Node (8h / 12h)         |
|     Pace: +1.5h Ahead  •  Streak: 5d [Forming]        |
|                                                       |
|  [ + Log Completed Work ]     [ Morning Calibration ] |
+-------------------------------------------------------+
|  [ Home Dashboard ]   [ Horizons ]   [ Weekly Retro ] |
+-------------------------------------------------------+
```

### Wireframe 2: Per-Goal Horizon Drilldown (Piano Objective)
```
+-------------------------------------------------------+
|  < Back     🎹 Learn Chopin Nocturne Op. 9 No. 2      |
|-------------------------------------------------------|
|  Domain: Craft  •  Horizon: Medium/Long  •  Status: ON TRACK |
|  Time Logged: 18.5 hrs Total  •  Target: 40 hrs       |
|                                                       |
|  PACE LINE TRAJECTORY:                                |
|  Expected: [-----------*---------] 20.0h by Sep 10    |
|  Actual:   [----------*----------] 18.5h (-1.5h gap)  |
|                                                       |
|  MOMENTUM & STREAK HEALTH:                            |
|  🔥 12-Day Established Streak (Heavy Penalty Active)  |
|  History: [x][x][x][x][x][x][x][x][x][x][x][x][ ][ ]  |
|                                                       |
|  MILESTONES (Option C Explicit Path):                 |
|  [✓] Milestone 1: Sight-read measures 1–12 (4.0h)     |
|  [>] Milestone 2: Memorize Page 1 hands-together (3.5h/6h) |
|  [ ] Milestone 3: Dynamic phrasing & rubato (0h/8h)   |
|  [ ] Milestone 4: Full recording performance (0h/10h) |
|                                                       |
|  [ Log Practice Session ]    [ View Pace Analytics ]  |
+-------------------------------------------------------+
```

### Wireframe 3: Daily Logging Modal (Reflecting Reality onto Capacity)
```
+-------------------------------------------------------+
|  LOG COMPLETED WORK                                   |
|-------------------------------------------------------|
|  Date: Today (Sep 9, 2026)                            |
|                                                       |
|  Objective: [ 🎹 Piano: Chopin Op. 9 No. 2      v ]   |
|  Milestone: [ Milestone 2: Memorize Page 1      v ]   |
|                                                       |
|  Hours Actually Spent: [ 1.5 ] hours                  |
|  Summary / Notes:                                     |
|  [ Memorized measures 8–12, practiced trills slowly ]  |
|                                                       |
|  Energy Level:  ( ) High   (•) Medium   ( ) Low       |
|                                                       |
|  Capacity Impact:                                     |
|  Remaining today: 3.0h -> 1.5h                        |
|  Remaining this week: 8.0h -> 6.5h                    |
|                                                       |
|  [ Cancel ]                  [ Save & Burn Down Time ]|
+-------------------------------------------------------+
```

### Wireframe 4: Weekly Retrospective (User as Coach)
```
+-------------------------------------------------------+
|  WEEK 37 RETROSPECTIVE: USER AS COACH                 |
|-------------------------------------------------------|
|  1. Capacity Audit:                                   |
|     Budget: 25.0h  |  Logged: 22.5h (90% Realized)    |
|     Overcommitment Flag: None                         |
|                                                       |
|  2. Pace Line Analysis:                               |
|     • Craft (Piano): -1.5h (Minor pace lag on Page 1) |
|     • Career (Rust Engine): +3.0h (Ahead of pace)     |
|     • Health: 0h logged (STARVED DOMAIN WARNING)      |
|                                                       |
|  3. Momentum & Streak Review:                         |
|     • Piano: 12 days active. High-momentum unlocked!   |
|                                                       |
|  4. Coach's Commitments for Next Week:                |
|     Target Hours: [ 25.0 ] hrs                        |
|     Allocation:                                       |
|     • Piano: 5.0h (Finish Page 1)                     |
|     • Rust Engine: 12.0h                              |
|     • Health (Rebalance): 5.0h (3 runs)               |
|                                                       |
|  [ Commit Next Week Plan & Calibrate Capacities ]     |
+-------------------------------------------------------+
```

---

## 5. Key Performance Indicators (KPIs)

| KPI | Description | Success Target |
| :--- | :--- | :--- |
| **Capacity Realization Rate** | Ratio of actual logged hours to planned hours | 80% – 105% (neither starved nor overburned) |
| **Pace Line Adherence** | % of active objectives tracking within ±15% of expected milestone pace | > 75% |
| **Re-Entry Recovery Rate** | % of broken streaks successfully restored after break via the icebreaker mechanic | > 85% |
| **Daily Logging Friction** | Time elapsed to complete daily execution log | < 90 seconds |
| **Retrospective Cadence** | Consistency of weekly user-as-coach retro completion | >= 4 out of 5 weeks |
