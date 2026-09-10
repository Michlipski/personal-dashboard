---
name: generate-dashboard-doc
description: Generates a new documentation or specification file for the Personal Dashboard project adhering to the docs-as-specification standard.
---
# Generate Personal Dashboard Documentation

When asked to create or update documentation for the Personal Dashboard repository, you MUST follow these formatting and structural standards.

## Required Frontmatter

Every documentation file MUST start with standard YAML frontmatter:

```yaml
---
title: "Document Title"
category: "product | technical-documentation | features | operations | infrastructure"
lastUpdated: "YYYY-MM-DD"
---
```

## Content & Section Guidelines by Category

### 1. Feature Specifications (`docs/features/`)
Must include:
- **1. Overview and Objective:** Problem solved and user value.
- **2. UX & Design Requirements:** Component layout, interaction flows, visual expectations.
- **3. Data & State Schema:** TypeScript interfaces and type definitions.
- **4. Cross-Platform Handling:** Differences between iOS, Android, and Web implementations.
- **5. Engineering Action Items:** Concrete, ordered technical tasks.

### 2. Product & Architecture (`docs/product/`, `docs/technical-documentation/`)
Must include:
- Mermaid diagrams for state, routing, or information architecture.
- Explicit component trees and directory layouts.
- Deterministic contracts (tokens, types, APIs).

## General Rules
1. Ensure all code blocks specify their language (e.g. `tsx`, `typescript`, `bash`, `mermaid`).
2. Adhere strictly to the design tokens in `src/constants/theme.ts`.
3. Save the document in the appropriate category folder under `/docs`.
