---
title: "Operations: Development & Release Workflow"
category: "operations"
lastUpdated: "2026-09-09"
---
# Operations: Development & Release Workflow

## 1. Environments & Commands

| Task | Command | Purpose |
| :--- | :--- | :--- |
| **Start Development Server** | `npx expo start` | Starts Metro bundler with interactive menu (w: web, i: iOS simulator, a: Android emulator) |
| **Start Web Directly** | `npx expo start --web` | Opens dashboard in local default browser |
| **Run Unit Tests** | `npm test` | Executes Stage 1 test suites (time, layout, water, report archiving) via `scripts/test-runner.js` |
| **Start Storybook (Native/Menu)** | `npm run storybook` | Starts app directly in Storybook component explorer mode |
| **Start Storybook (Web)** | `npm run storybook:web` | Launches Storybook in browser with collapsible component categories |
| **Run Linter** | `npx expo lint` | Validates TypeScript and ESLint rules |
| **Typecheck** | `yarn tsc --noEmit` / `npx tsc --noEmit` | Strict TypeScript type validation |
| **Reset Project** | `npm run reset-project` | Moves existing starter code to `/example` for clean slate |

---

## 2. Testing & Quality Verification

Before committing any feature or UI refactor, agents and engineers must execute:
1. **Unit Tests:** Run `npm test` to ensure all algorithmic suites (layout collision, time math, hydration metrics, report aggregation & archiving) pass 100%.
2. **Type Check:** Confirm TypeScript compilation passes with zero errors (`tsc --noEmit`).
3. **Lint Check:** Ensure no ESLint errors exist.
4. **Storybook Verification:** Check that all UI primitives, cards, and modal dialogs are documented with interactive CSF stories in `src/components/daily/stories/` and organized into appropriate categories.
5. **Platform Check:** Verify the UI runs cleanly on web without hydration errors and without web-only DOM primitives crashing native views.

---

## 3. Git & Branching Strategy

1. **Feature Branches:** Create branches named `feature/<feature-name>` or `fix/<fix-name>` from `main`.
2. **PR Validation:** Verify that documentation in `/docs` is updated alongside code changes.
3. **Merging:** Merge to `main` once code review and local checks are complete.
