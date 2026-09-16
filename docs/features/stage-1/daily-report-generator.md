---
title: "Feature Specification: Daily Report Generator & JSON Exporter"
category: "features"
stage: "stage-1"
lastUpdated: "2026-09-09"
---
# Feature Specification: Daily Report Generator & JSON Exporter

## 1. Overview and Objective
The Daily Report Generator provides a unified mechanism to synthesize the day's scheduled accomplishments, task completion states, and health vitals into an exportable, standardized JSON data object.

**The Stage 1 Role:** Before persistent backend databases or cloud sync are introduced in Stage 2, this generator acts as the portable data snapshot. Users can generate their report at the end of the day, review the summary, copy the JSON to their system clipboard, and rely on local client caching to preserve records.

---

## 2. Core Functional Requirements

1. **One-Tap Aggregation:** Automatically merges:
   - All `ScheduleBlock` items (strict appointments, loose practice sessions, zero-duration habits).
   - Execution status (`isCompleted`, timestamps).
   - All `DailyHealthMetrics` (water intake, energy, mood, screen time).
2. **Deterministic Summary Calculations:**
   - Total scheduled minutes vs completed focus minutes.
   - Completion percentage.
   - Habit streak signals.
3. **Export & Archiving Triggers (Stage 1 Scope):**
   - **`Copy to Clipboard`:** Copies formatted JSON payload to clipboard with tactile feedback.
   - **`Local Cache Snapshot`:** Saves the finalized report into `daily_reports_archive_YYYY-MM-DD` and indexes the date in `archived_report_dates`.
   - **`Automated Rollover Archive`:** Triggered when the user taps `🌅 Start New Day`. Before advancing to tomorrow, today's complete summary report payload is synthesized and archived to client storage automatically.
4. **Historical Archive Browser (`📜 Past Reports` Tab):**
   - A dedicated third tab in the Daily view (`DailyPastReportsScreen`).
   - Displays all archived report dates in descending chronological order (most recent first).
   - Instant selection displays full executive summary metrics, Schema v1.0 JSON payload, and clipboard copy action.
   - Includes snapshot deletion and auto-seeding for clean zero-state experiences.

---

## 3. Daily Report JSON Schema & Concrete Example

The exported JSON payload follows this explicit schema, featuring an active piano practice session alongside routine tasks:

```json
{
  "reportVersion": "1.0",
  "generatedAt": "2026-09-09T21:45:00.000Z",
  "date": "2026-09-09",
  "summary": {
    "totalScheduledMinutes": 480,
    "completedMinutes": 390,
    "completionRate": 0.81,
    "zeroDurationItemsTotal": 2,
    "zeroDurationItemsCompleted": 2
  },
  "scheduleItems": [
    {
      "id": "item-001",
      "title": "Take Morning Vitamin D3 & K2",
      "type": "zero_duration",
      "sessionType": "habit_checkpoint",
      "startTime": "08:00",
      "durationMinutes": 0,
      "endTime": "08:00",
      "status": "completed",
      "isCompleted": true,
      "completedAt": "2026-09-09T08:05:12.000Z",
      "notes": "Taken with breakfast fat source"
    },
    {
      "id": "item-002",
      "title": "Architectural Design Review",
      "type": "strict",
      "sessionType": "appointment",
      "startTime": "09:00",
      "durationMinutes": 60,
      "endTime": "10:00",
      "status": "completed",
      "isCompleted": true,
      "completedAt": "2026-09-09T10:02:00.000Z"
    },
    {
      "id": "item-003",
      "title": "🎹 Piano Practice: Chopin Nocturne Op. 9 No. 2",
      "type": "loose",
      "sessionType": "deliberate_practice",
      "startTime": "13:30",
      "durationMinutes": 45,
      "endTime": "14:15",
      "status": "completed",
      "isCompleted": true,
      "completedAt": "2026-09-09T14:18:22.000Z",
      "objectiveId": "obj-piano-mastery",
      "notes": "Focused strictly on Page 1 measures 8-12 hands together. High articulation."
    },
    {
      "id": "item-004",
      "title": "Rust Systems Engine Development",
      "type": "loose",
      "sessionType": "focus_deep_work",
      "startTime": "15:00",
      "durationMinutes": 120,
      "endTime": "17:00",
      "status": "missed",
      "isCompleted": false,
      "missedAt": "2026-09-09T17:00:00.000Z",
      "notes": "Shifted time to urgent infrastructure triage"
    }
  ],
  "healthVitals": {
    "waterIntake": {
      "glasses": 7,
      "targetGlasses": 8,
      "milliliters": 1750,
      "percentageOfTarget": 0.875
    },
    "energyLevel": "medium",
    "mood": "good",
    "moodNotes": "Sustained good mental clarity during afternoon piano practice session.",
    "screenTime": {
      "totalMinutes": 330,
      "productiveMinutes": 270,
      "leisureMinutes": 60
    }
  }
}
```

---

## 4. UI & Screen Layout

### ASCII Wireframe: Report Generator Modal
```
+-------------------------------------------------------+
|  DAILY REPORT: WEDNESDAY, SEP 9, 2026                 |
|-------------------------------------------------------|
|  EXECUTION SUMMARY                                    |
|  • Scheduled Time: 8.0 hrs  • Completed: 6.5 hrs      |
|  • Completion Rate: 81%     • Habits: 2/2 Checked     |
|  • Water: 7/8 Glasses (87%) • Energy: Medium          |
|                                                       |
|  JSON DATA PAYLOAD                                    |
|  +-------------------------------------------------+  |
|  | {                                               |  |
|  |   "date": "2026-09-09",                         |  |
|  |   "summary": { "completionRate": 0.81 ... },    |  |
|  |   "scheduleItems": [                            |  |
|  |     { "title": "🎹 Piano Practice: Chopin...",  |  |
|  |       "durationMinutes": 45, ... }              |  |
|  |   ], ...                                        |  |
|  | }                                               |  |
|  +-------------------------------------------------+  |
|                                                       |
|  [ 📋 Copy JSON to Clipboard ]       [ Close ]        |
+-------------------------------------------------------+
```

---

## 5. Engineering Action Items

1. **Aggregation Utility (`generateDailyReport.ts`):** Merges `useScheduleStore` and `useHealthMetricsStore` into the canonical JSON structure.
2. **Clipboard Hook & Copy Button:** Uses `copyTextToClipboard` and `CopyReportButton` with a 2000ms visual confirmation badge (`[ ✓ Copied! ]`).
3. **Archive Storage & Queries (`report.ts`):** Implements `saveDailyReportSnapshot`, `getArchivedReportDates`, and `getArchivedDailyReport` saving into client storage under `daily_reports_archive_YYYY-MM-DD` and indexing active dates.
4. **Day Rollover Linkage (`StartNewDayConfirmModal.tsx`):** Coordinates summary generation and archiving before advancing the dashboard calendar date to tomorrow.
