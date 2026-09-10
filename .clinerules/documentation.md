# Documentation Rules & Standards

1. **Docs-as-Specification:** The `/docs` folder serves as the central source of truth for the repository.
2. **Mandatory Documentation Categories:**
   - `docs/product/`: Narrative, PRDs, design system tokens, and user flow diagrams.
   - `docs/technical-documentation/`: Architecture overviews, runtime details, and client service specs.
   - `docs/features/`: Granular specifications for individual tools and widgets.
   - `docs/operations/`: Development workflows, build, lint, and release guidelines.
   - `docs/infrastructure/`: Tooling, environment dependencies, and SDK version configurations.
3. **Spec Standards:**
   - Every specification must begin with YAML frontmatter specifying `title`, `category`, and `lastUpdated`.
   - Component guidelines must map directly to tokens in `src/constants/theme.ts`.
   - Never implement features or architectural changes without validating against or updating the corresponding specification file.
