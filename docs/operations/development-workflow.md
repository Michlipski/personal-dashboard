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
| **Run Linter** | `npx expo lint` | Validates TypeScript and ESLint rules |
| **Typecheck** | `yarn tsc --noEmit` | Strict TypeScript type validation |
| **Reset Project** | `npm run reset-project` | Moves existing starter code to `/example` for clean slate |

---

## 2. Testing & Quality Verification

Before committing any feature or UI refactor, agents and engineers must execute:
1. **Lint Check:** Ensure no ESLint errors exist.
2. **Type Check:** Confirm TypeScript compilation passes without errors.
3. **Platform Check:** Verify the UI runs cleanly on web without hydration errors and without web-only DOM primitives crashing native views.

---

## 3. Git & Branching Strategy

1. **Feature Branches:** Create branches named `feature/<feature-name>` or `fix/<fix-name>` from `main`.
2. **PR Validation:** Verify that documentation in `/docs` is updated alongside code changes.
3. **Merging:** Merge to `main` once code review and local checks are complete.
