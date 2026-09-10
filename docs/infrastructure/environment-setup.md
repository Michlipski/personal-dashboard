---
title: "Infrastructure: Environment Setup & Tooling"
category: "infrastructure"
lastUpdated: "2026-09-09"
---
# Infrastructure: Environment Setup & Tooling

## 1. Runtime & Package Management
* **Node.js:** Node 20+ LTS recommended.
* **Package Manager:** Yarn Berry with `nodeLinker: node-modules` (configured in `.yarnrc.yml`).
  * Lockfile: `yarn.lock` must be committed and kept clean.
  * Dependency installation: `yarn install`.

---

## 2. Framework & SDK Dependencies

* **Expo SDK Version:** `57.0.6`
* **React:** `19.2.3`
* **React Native:** `0.86.0`
* **TypeScript:** `6.0.3` (Pinned via `package.json` and governed by `tsconfig.json`)

---

## 3. Recommended IDE Extensions & Settings

* **VSCode Extensions (`.vscode/extensions.json`):**
  * `expo.vscode-expo-tools`
* **Editor Rules (`.vscode/settings.json`):**
  * Format on save enabled.
  * Auto-organize imports on save (`source.organizeImports: "explicit"`).
  * Sort members on save (`source.sortMembers: "explicit"`).
