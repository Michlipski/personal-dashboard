---
title: "User Flow & Ritual Cadence Specification"
category: "product"
lastUpdated: "2026-09-09"
---
# User Flow & Ritual Cadence Specification

**Document Purpose:** Maps user interaction flows, multi-horizon navigation, daily capacity logging, re-entry momentum mechanics, and the weekly retrospective ritual.

---

## 1. High-Level Navigation & System Flow

```mermaid
graph TD
    %% Entry & Horizon Navigation
    AppLaunch[App Launch / Home] --> MacroView[Multi-Horizon Dashboard]
    
    MacroView --> HorizonSelect{Select Horizon}
    HorizonSelect -->|Short-Term| STView[Short-Term View: Today/Week Focus & Capacity]
    HorizonSelect -->|Medium-Term| MTView[Medium-Term View: Milestone Pace Lines]
    HorizonSelect -->|Long-Term| LTView[Long-Term View: North Star Domain Radar]

    %% Drilldown & Suggestions
    MacroView --> SuggestionCard[Review Planning Suggestion]
    SuggestionCard -->|Accept| AutoSchedule[Adopt Suggestion & Adjust Capacity]
    
    MacroView --> GoalDrilldown[Select Objective: Per-Goal Detail]
    GoalDrilldown --> PaceLineView[Inspect Pace Line & Milestone Chain]
    GoalDrilldown --> StreakCard[Review Momentum & Streak Health]

    %% Ritual Triggers
    MacroView --> DailyLogTrigger[Click 'Log Completed Work']
    MacroView --> MorningTrigger[Launch Morning Calibration]
    MacroView --> RetroTrigger[Launch Weekly Retrospective]
```

---

## 2. Daily Cadence: Execution Logging & Capacity Burndown

The daily flow bridges planned intentionality with actual execution, immediately burning down the user's capacity budget:

```mermaid
graph TD
    A[Start of Day] --> B[Morning Calibration: Review Daily Budget & Top Focus Blocks]
    B --> C[Execute Focused Work Session]
    C --> D[Open 'Log Completed Work' Modal]
    D --> E[Select Objective & Milestone]
    D --> F[Input Hours Spent & Felt Energy]
    D --> G[Add Reflection Note]
    F --> H{System Updates}
    H --> I[Deduct from Remaining Daily Capacity]
    H --> J[Deduct from Remaining Weekly Capacity]
    H --> K[Advance Objective Logged Hours & Milestone Progress]
    H --> L[Update Streak & Momentum State]
    L --> M[Refresh Planning Suggestions]
```

### Step-by-Step UX Breakdown: Daily Logging
1. **Trigger:** User taps `+ Log Completed Work` on the dashboard or goal detail view.
2. **Input Fields:**
   - **Objective / Milestone Dropdown:** Pre-selected if initiated from goal screen.
   - **Hours Actually Spent:** Step input (e.g., 0.5h, 1.0h, 1.5h).
   - **Felt Energy:** 3-tap segmented control (`High`, `Medium`, `Low`).
   - **Reflection Note:** Optional one-sentence reflection.
3. **Immediate System Feedback:**
   - Visual gauge animates: `Remaining Today: 3.5h -> 2.0h`.
   - Goal progress bar advances.
   - Streak counter glows with confirmation indicator.

---

## 3. Momentum & Re-Entry Protocol Flow

Models human habits with asymmetric rigor: rewarding established consistency while smoothing post-break re-entry:

```mermaid
graph TD
    CheckIn[User Returns to App] --> StatusCheck{Check Last Active Date}
    
    %% Active Momentum
    StatusCheck -->|< 36 Hours| ActiveCheck{Streak Days?}
    ActiveCheck -->|< 10 Days| FormingState[Forming Phase: Gentle Encouragement]
    ActiveCheck -->|>= 10 Days| HighMomentum[High Momentum: High Miss Penalty Active]
    HighMomentum -->|valid reason| NotedException[Noted Exception. Keep tabs on it]
    HighMomentum -->|missed without reason| PenaltyApplied[Apply Heavy Streak Penalty]

    %% Break Detected
    StatusCheck -->|>= 36 Hours / Vacation| BreakType{Break Context}
    BreakType -->|Unexcused Inactive| PenaltyApplied[Apply Heavy Streak Penalty]
    BreakType -->|Post-Vacation / Trip| ReEntryProtocol[Activate Re-Entry Protocol]

    %% Re-Entry Mechanism
    ReEntryProtocol --> Step1[Suggestion: Schedule 5-10m Icebreaker Block]
    Step1 --> IcebreakerDone{Icebreaker Completed?}
    IcebreakerDone -->|No| IcebreakerPrompt[Remind: Low Barrier to Start]
    IcebreakerDone -->|Yes| Step2[Schedule Regular Focus Block]
    Step2 --> StandardDone{Focus Block Completed?}
    StandardDone -->|Yes| Restored[Streak Restored & High Momentum Resumed]
```

### Step-by-Step UX Breakdown: Post-Vacation Re-Entry
1. **Detection:** User returns after a multi-day trip. Instead of a zero-out warning, the dashboard highlights a **Re-Entry Alert**:
   > *"Welcome back! Let's get momentum moving without friction. We've preserved your streak in Re-Entry Mode."*
2. **Icebreaker Suggestion:** The engine proposes a 10-minute micro-session (e.g., *"Play through Chopin measures 1–4 once"*).
3. **Execution & Earn-Back:** Upon logging the icebreaker, the system offers a standard focus block later that afternoon. Completing both marks the streak as **Restored**, avoiding demotivating resets while preserving integrity.

---

## 4. Weekly Retrospective: User as Coach Flow

Once a week (e.g., Sunday evening or Monday morning), the user steps into the coach role:

```mermaid
graph TD
    LaunchRetro[Start Weekly Retrospective] --> Step1_Capacity[Step 1: Capacity Realization Audit]
    Step1_Capacity -->|Compare Planned vs Logged| Step2_Pace[Step 2: Pace Line & Deficit Analysis]
    Step2_Pace -->|Identify Ahead / Behind Goals| Step3_Starved[Step 3: Starved Domain Diagnostic]
    Step3_Starved -->|Surface Neglected Horizons| Step4_Coaching[Step 4: User-as-Coach Decisions]
    Step4_Coaching --> Action1[Adjust Milestone Target Dates]
    Step4_Coaching --> Action2[Reallocate Hours Across Domains]
    Step4_Coaching --> Action3[Approve Next Week Capacity Budget]
    Action3 --> FinalCommit[Commit Plan: Seed Next Week Dashboard]
```

### Step-by-Step UX Breakdown: Weekly Retrospective
1. **Step 1 (Capacity Audit):** System displays a clean visual breakdown of the week's 25-hour budget: `21.5h Logged (86% Realized)`. Highlights whether user overburned or underutilized.
2. **Step 2 (Pace Line Analysis):** Renders progress curves for active milestones. Shows which objectives advanced ahead of target and which accumulated a pace deficit.
3. **Step 3 (Starved Domain Diagnostic):** Flags any life domain that received 0 hours of focus during the week (e.g. Health).
4. **Step 4 (Coach's Strategic Commitments):** The user writes 1–2 coaching notes for themselves and sets the hour allocations for next week's horizon commitments before finalizing.
