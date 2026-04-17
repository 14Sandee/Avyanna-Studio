---
name: typescript
description: TypeScript coding rules for all TS/TSX projects.
---

# TypeScript Rules

- **Strict mode always** — `"strict": true` in tsconfig.json. No exceptions.
- **No `any`** — use `unknown` and narrow with type guards. If you must, document why.
- **Prefer `const`** over `let`. Never use `var`.
- **Zod for runtime validation** — validate all external data (API responses, form input, env vars) with Zod schemas.
- **Type all function signatures** — parameters and return values must have explicit types.
- **Prefer `type` over `interface`** — use `type` for unions, intersections, and mapped types. Use `interface` only for declaration merging (rare).
- **No non-null assertions (`!`)** — use proper null checks or optional chaining.
- **Exhaustive switch** — use `never` type to ensure all cases are handled in discriminated unions.
- **No barrel files** — avoid `index.ts` re-exports. Import directly from source files for better tree-shaking.
