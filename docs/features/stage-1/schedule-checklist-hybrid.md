---
title: "Feature Specification: Daily Schedule & Checklist Hybrid"
category: "features"
stage: "stage-1"
lastUpdated: "2026-09-09"
---
# Feature Specification: Daily Schedule & Checklist Hybrid

## 1. Overview and Objective
The Daily Schedule & Checklist Hybrid provides a unified 24-hour interface bridging calendar-style time blocks and tactile task checklists. Users plan, adjust, and check off items throughout their day from a single view.

**The Problem:** Traditional calendars don't provide checkboxes or habit triggers, while traditional to-do lists fail to anchor tasks into the finite reality of a 24-hour day. 
**The Solution:** A 24-hour vertical timeline where scheduled activities occupy the left side of the time ruler, while zero-duration habit checkpoints stack on the right side with collision-resistant leader lines and tri-state circular checkboxes.

---

## 2. Block Types & Behavioral Taxonomy

The system defines three distinct schedule block categories:

| Block Category | Definition | Duration | Column Position | Conflict Behavior | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strictly Scheduled** | Fixed commitments bound to a specific calendar window | > 0 mins | **Left Half (50%)** | Overlaps trigger visual conflict warning | Doctor's Appointment (10:00–11:00 AM) |
| **Loosely Scheduled** | Flexible, variable-duration activities | > 0 mins | **Left Half (50%)** | Flexible; can be shifted or re-ordered | Piano Practice (1:00 PM, 45m), Lunch |
| **Zero-Duration** | Instantaneous habits or checkpoints tied to a time of day | `0` mins | **Right Half (50%)** | **Never conflicts**; stacks with connecting leader lines | Take Morning Vitamins (8:00 AM) |

---

## 3. 24-Hour Vertical Calendar Layout Architecture

The schedule renders a continuous vertical 24-hour time ruler (from `00:00` to `23:59`), reminiscent of Google Calendar, but split into two distinct horizontal execution lanes:

```
+-----------------------------------------------------------------------------+
| TIME  | LEFT LANE (50% Width)              | RIGHT LANE (50% Width)         |
| RULER | Duration Blocks (>0 mins)          | Zero-Duration Items (0 mins)   |
+-----------------------------------------------------------------------------+
| 08:00 |                                    | [○] Take Vitamin D3 & K2       |
|       |                                    |                                |
| 09:00 | +--------------------------------+ |                                |
|       | | [🟢] Team Architecture Sync    | |                                |
|       | | 09:00 - 10:00 (60m) • Strict   | |                                |
| 10:00 | +--------------------------------+ |                                |
|       |                                    |                                |
| 13:00 |                                    | [○] Post-Lunch Hydration Check |
|       |                                    |  \                             |
| 13:30 | +--------------------------------+ |   \ (Connecting Leader Line)   |
|       | | [○] 🎹 Piano Practice          | |    \                           |
|       | | 13:30 - 14:15 (45m) • Chopin   | |     --> [🔴] Afternoon Meds    |
| 14:00 | +--------------------------------+ |                                |
+-----------------------------------------------------------------------------+
```

### 1. Left Lane: Duration Block Items (50% Width)
* **Scope:** All Strictly Scheduled and Loosely Scheduled items with `durationMinutes > 0`.
* **Geometry:** Height is mathematically proportional to the duration based on the vertical scale factor (e.g. `60px = 1 hour`).
* **Header at Top:** Every block features its header pinned to the top edge:
  - Tri-state circular checkbox.
  - Item Title (e.g., `Team Architecture Sync` or `🎹 Piano Practice`).
  - Time range & session badge (`09:00 - 10:00 • Strict Appointment`).
* **Visual Styling:** Rounded card container with colored border accent derived from the associated life domain or session category.

### 2. Right Lane: Non-Block Zero-Duration Items (50% Width)
* **Scope:** All Zero-Duration items (`durationMinutes === 0`) such as medication, vitamins, quick check-ins, or habit triggers.
* **Anchor & Collision Handling:**
  - **Natural Placement:** Positioned vertically at the exact time tick of the item (e.g., 08:00 AM).
  - **Collision Stacking:** If multiple non-block items share the same time, or if their vertical bounding boxes collide, subsequent items are pushed down to the **next available unoccupied vertical line** in the right lane.
  - **Connecting Leader Lines:** When an item is displaced downward due to a visual collision, an angled connecting line (leader line) visually links the card back to its exact anchor tick mark on the central time ruler.

---

## 4. Tri-State Circular Checkbox Contract

Next to every item name (on both the left and right lanes), a circular checkbox provides tactile status cycling on tap:

```
  [ Empty Circle ]  ──(tap)──>  [ Green Checked ]  ──(tap)──>  [ Red X-ed Out ]  ──(tap)──>  [ Empty Circle ]
         ○                              🟢 ✓                           🔴 ✗
    (Pending / Open)              (Completed / Done)             (Missed / Skipped)
```

1. **State 1: Pending (`pending`)**
   - Icon: Clean, empty circular ring (`border-2 border-muted-foreground`, no fill).
   - Meaning: Item is scheduled and awaiting execution.
2. **State 2: Completed (`completed`)**
   - Icon: Solid emerald green circle with a white checkmark (`bg-emerald-500 text-white ✓`).
   - Title Style: Subtle strike-through and dimmed text opacity (0.7).
   - System Impact: Immediately burns down planned capacity and records completion timestamp.
3. **State 3: Missed / Skipped (`missed`)**
   - Icon: Solid coral red circle with a white X mark (`bg-red-500 text-white ✗`).
   - Title Style: Dimmed text with a red-tinted indicator.
   - System Impact: Marks item as skipped/missed without allocating completed focus hours; informs the daily report and streak diagnostic.

---

## 5. Block Configuration & Time Calculation Rules

Selecting any block opens the **Block Configuration Modal / Menu**.

### Dynamic Calculation Engine
The configuration modal exposes three interconnected time inputs:
1. **Start Time** (`HH:mm`)
2. **Duration** (`minutes` or `hours`)
3. **End Time** (`HH:mm`)

The editor enforces the following bidirectional mathematical contract:
* **Case 1: User edits Start Time**
  $$\text{endTime} = \text{startTime} + \text{duration}$$
  *(Duration remains constant; End Time shifts automatically).*
* **Case 2: User edits Duration**
  $$\text{endTime} = \text{startTime} + \text{duration}$$
  *(Start Time remains constant; End Time recalculates).*
* **Case 3: User edits End Time**
  $$\text{duration} = \text{endTime} - \text{startTime}$$
  *(Start Time remains constant; Duration recalculates).*
* **Special Case: Zero-Duration Items**
  Duration is locked at `0`. Setting or modifying the timestamp automatically sets `endTime = startTime`.

---

## 6. Local Caching & Persistence (Stage 1)

Prior to the backend database introduced in Stage 2, the schedule is persisted to local client storage (`AsyncStorage` on Native, `localStorage` on Web):
* **Auto-Cache on Mutation:** Any checkbox toggle (pending -> completed -> missed), time edit, or block addition immediately serializes the day's schedule to the active date key (e.g. `schedule_cache_2026-09-09`).
* **Day-Long Resilience:** The user can reload the browser, switch apps, or check in throughout the day without losing checked states or schedule adjustments.

---

## 7. Data Schema & TypeScript Interfaces

```typescript
export type ScheduleBlockType = 'strict' | 'loose' | 'zero_duration';

export type ItemStatus = 'pending' | 'completed' | 'missed';

export type SessionType = 
  | 'focus_deep_work' 
  | 'deliberate_practice' 
  | 'routine_maintenance' 
  | 'appointment' 
  | 'habit_checkpoint' 
  | 'rest_recovery';

export interface ScheduleBlock {
  id: string;
  title: string;
  type: ScheduleBlockType;
  sessionType: SessionType;
  startTime: string;        // "HH:mm" e.g. "13:30"
  durationMinutes: number;  // 0 for zero-duration items
  endTime: string;          // "HH:mm" e.g. "14:15"
  status: ItemStatus;       // 'pending' | 'completed' | 'missed'
  completedAt?: string;     // ISO timestamp when marked completed
  missedAt?: string;        // ISO timestamp when marked missed
  objectiveId?: string;     // Optional link to long/medium-term goal
  notes?: string;
}

export interface NonBlockLayoutItem {
  block: ScheduleBlock;
  anchorY: number;          // Exact time position on time ruler (px)
  renderedY: number;        // Displaced position after collision stacking (px)
  isDisplaced: boolean;     // True if displaced from anchorY
}

export interface DailyScheduleState {
  date: string; // "YYYY-MM-DD"
  blocks: ScheduleBlock[];
  hasConflicts: boolean;
  conflictingBlockIds: string[];
}
```

---

## 8. Header Actions & Day Management Controls

The top header bar coordinates executive controls for the day:
* **`📊 Generate Report` (Primary Action):** Compiles and displays the end-of-day summary payload with clipboard and client archive export.
* **`↺ Reset` (Secondary Action):** Opens `ResetConfirmModal`. Confirms resetting today's schedule items back to `pending` (clearing timestamps) and resetting health vitals to clean defaults.
* **`🌅 Start New Day` (Rollover Action):** Opens `StartNewDayConfirmModal`. Automatically generates and stores today's full summary JSON report into client storage (`daily_reports_archive_YYYY-MM-DD` and `archived_report_dates`), then advances the dashboard date to tomorrow with routine blocks reset to `pending` and vitals zeroed.

---

## 9. Floating Action Button (FAB) for Adding Items

A circular Floating Action Button (FAB) is anchored to the bottom-right of the viewport, styled identically to Google Calendar's creation trigger:
* **Visual Styling:** Elevated circular button ($56\times56\text{px}$) with a prominent plus icon (`+`), drop shadow, and primary brand accent background (`#3B82F6` or theme primary).
* **Position:** Fixed floating position at `bottom: 24px`, `right: 24px`, hovering above the scrolling 24-hour timeline.
* **Tap Behavior:** Opens the `BlockConfigModal` in **Creation Mode** with intelligent defaults:
  - Default Start Time: Rounded to the next upcoming 15-minute boundary from the current time (e.g. at 13:07, defaults to 13:15).
  - Default Duration: 30 minutes (or 0 minutes if toggled to Zero-Duration Habit).
  - Default End Time: Automatically calculated as Start Time + Duration.
  - Option to toggle between `Duration Block (Left Lane)` and `Zero-Duration Habit (Right Lane)`.

---

## 10. UI & Screen Layout

### ASCII Wireframe: 24-Hour Split Timeline with Header Actions & FAB
```
+-----------------------------------------------------------------------------+
|  DAILY EXECUTION ENGINE   WEDNESDAY, SEP 9    [ 📊 Report ] [ ↺ Reset ] [ 🌅 New Day ]
|  [ (•) Schedule & Plan ]  [ Daily Health & Vitals ]  [ Past Reports ]       |
|-----------------------------------------------------------------------------|
| TIME  | LEFT HALF (Duration Blocks)        | RIGHT HALF (Zero-Time Habits)  |
|-------+------------------------------------+--------------------------------|
| 07:00 |                                    |                                |
| 08:00 |                                    | [🟢] Take Vitamin D3 & K2      |
|       |                                    |                                |
| 09:00 | +--------------------------------+ |                                |
|       | | [🟢] Team Architecture Sync    | |                                |
|       | | 09:00 - 10:00 (60m) • Strict   | |                                |
| 10:00 | +--------------------------------+ |                                |
|       |                                    |                                |
| 12:30 | +--------------------------------+ |                                |
|       | | [🟢] Lunch & Walk              | |                                |
|       | | 12:30 - 13:15 (45m) • Loose    | |                                |
| 13:00 | +--------------------------------+ | [🟢] 10m Post-Meal Walk Habit  |
|       |                                    |  \                             |
| 13:30 | +--------------------------------+ |   \ (Leader Line)              |
|       | | [○] 🎹 Piano: Chopin Op. 9 No 2| |    \                           |
|       | | 13:30 - 14:15 (45m) • Practice | |     --> [🔴] Hydration Pill 2  |
| 14:00 | +--------------------------------+ |                                |
|       |                                    |                                |
| 16:00 | +--------------------------------+ |                                |
|       | | [🔴] Dentist Appointment       | |                                |
|       | | 16:00 - 17:00 (60m) • Strict   | |                                |
| 17:00 | +--------------------------------+ |                                |
|-------+------------------------------------+--------------------------------|
|                                                                    [ (+) FAB]
+-----------------------------------------------------------------------------+
```

### ASCII Wireframe: Block Configuration Modal
```
+-------------------------------------------------------+
|  CREATE / EDIT SCHEDULE BLOCK                         |
|-------------------------------------------------------|
|  Title: [ 🎹 Piano Practice: Chopin Op. 9 No. 2     ] |
|  Type:  ( ) Strict Appointment   (•) Loose Variable   |
|         ( ) Zero-Duration Habit                       |
|                                                       |
|  Status: [ ( ) Pending   (•) Completed   ( ) Missed ] |
|                                                       |
|  Session Category: [ Deliberate Practice            v]|
|                                                       |
|  Start Time: [ 13:30 ] (1:30 PM)                      |
|  Duration:   [   45 ] minutes                         |
|  End Time:   [ 14:15 ] (2:15 PM) [auto-calculated]   |
|                                                       |
|  Link to Objective: [ 🎹 Piano: Chopin Op. 9 No. 2 v] |
|  Notes: [ Work through measures 8-12 hands together ] |
|                                                       |
|  [ Delete Block ]              [ Cancel ]   [ Save ]  |
+-------------------------------------------------------+
```

---

## 11. Engineering Action Items

1. **Floating Action Button (`AddScheduleItemFab.tsx`):** Fixed circular bottom-right trigger dispatching modal in creation mode.
2. **24-Hour Timeline Grid (`Timeline24Hour.tsx`):** Scrollable vertical container rendering 24 hourly ticks (`00:00` to `23:00`) with a configurable hour height (e.g., `64px/hour`).
3. **Left-Lane Block Renderer (`LeftDurationBlock.tsx`):** Calculates `top = (startMinutes / 60) * hourHeight` and `height = (durationMinutes / 60) * hourHeight`. Renders header at top.
4. **Right-Lane Stacking & Leader Lines (`RightLaneZeroDurationBlock.tsx`):** Computes visual collision offsets for items near the same timestamp. Draws SVG connecting lines from `(x0, anchorY)` to `(x1, renderedY)`.
5. **Tri-State Checkbox Primitive (`TriStateCheckbox.tsx`):** Handles tap event to cycle `pending -> completed -> missed -> pending`.
6. **State & Cache Store (`useScheduleStore`):** Manages block list with auto-persistence, `resetSchedule()`, and `startNewDaySchedule()`.
7. **Confirmation Modals (`ResetConfirmModal.tsx`, `StartNewDayConfirmModal.tsx`):** Modals protecting destructive resets and automating summary report archiving upon day rollover.
