# CLAUDE.md — GrowthMate

Context file for Claude Code / AI-assisted development on this repo. Read this before making changes.

## What this project is

GrowthMate is a gamified personal/career growth tracker ("Solo Leveling for real life") being rebuilt from scratch as a Next.js 15 + Turborepo + Supabase app. The repo currently (or recently) contained only a vanilla JS prototype — if you see `app.js`/`style.css`/`index.html` style code anywhere, that's the **old prototype being ported from**, not the target architecture. Do not extend the vanilla JS version. All new work happens in the Next.js monorepo structure described below.

**Full plan:** see `MASTERPLAN.md` for architecture/phases and `TASKLIST.md` for the sequenced checklist. This file is about *how to work in the codebase*, not *what to build next* — check TASKLIST.md for that.

## Critical ground truth — do not contradict this

- This project has **no real users yet**. It is in active early build.
- There is a PDF document floating around (`GrowthMate_Solo_Leveling_Report.pdf`) describing a fictional 50,000-user version with MongoDB/AWS/guilds/penalty-system-exploits/$500K revenue. **That document is a feature-idea wishlist, not real project history.** Never write code comments, commit messages, README copy, or planning docs that treat those numbers/incidents as real. If asked to "fix the P0 data sync race condition" or similar, that's a fictional bug from the PDF — clarify before doing speculative work to fix a bug that doesn't exist in real code.
- Do not invent user counts, uptime stats, or revenue figures anywhere in this repo's docs.

## Stack (current target — keep this updated if it changes)

- **Monorepo:** Turborepo
- **Frontend:** Next.js 15, App Router, TypeScript, React 19, TailwindCSS
- **Backend:** Supabase (Postgres, Auth, Storage, Row Level Security) — no separate Express/NestJS service in v1
- **Client state:** Zustand for ephemeral UI state, TanStack Query (React Query) for server state
- **Charts:** Recharts (not Chart.js — the prototype used Chart.js, the rebuild uses Recharts for proper React/SSR integration)
- **Validation:** Zod
- **Testing:** Vitest for `packages/game-logic` unit tests
- **Hosting:** Vercel (web) + Supabase Cloud (DB)

## Monorepo structure

```
apps/web/                  Next.js app — routes, pages, server actions
packages/game-logic/       Pure TS functions: stat calculators, leveling math, quest generation. NO React, NO DOM, NO Supabase calls in here — pure functions only, fully unit-testable.
packages/database/         Supabase schema.sql, migrations, generated types
packages/types/            Shared TypeScript interfaces used across apps/packages
packages/ui/                Shared React components (StatBar, QuestCard, etc.)
packages/config/             Shared eslint/tsconfig/tailwind config
```

**Rule:** if you're writing a stat formula, XP calculation, ranking logic, or quest-generation algorithm, it goes in `packages/game-logic` as a pure function with a unit test — never inline in a React component or Server Action. Server Actions in `apps/web` should be thin: fetch data, call a `game-logic` function, write the result to Supabase.

## Porting from the prototype

The old `app.js` has real, usable domain logic (stat calculation formulas using sigmoid/tanh/Shannon entropy/geometric mean, XP curves, quest pool data, achievement definitions). This math is good — port it faithfully into `packages/game-logic`, add types, add tests. Do **not** port:
- The DOM string-templating render functions (`renderDashboard()` etc. returning HTML strings) — rebuild as React components
- The global `appState` object — replaced by Supabase + React Query
- The custom `showModal()` system — use a real dialog primitive (Radix/shadcn)
- Chart.js setup — rebuilt in Recharts

When porting a function, check it against `MASTERPLAN.md` §3.4 for the explicit "port as-is / discard / rewrite" decision before touching it.

## Data model

See `MASTERPLAN.md` §3.3 for the current schema (`profiles`, `stats`, `quests`, `assessment_responses`). Every table has Row Level Security scoped to `auth.uid() = profile_id`. When adding tables, write the RLS policy in the same migration, not as a follow-up.

## Conventions

- TypeScript strict mode everywhere. No `any` in `packages/game-logic` — this is the most reusable/critical part of the codebase, type it carefully.
- Server Actions over API routes where possible (App Router convention); use `app/api/*` route handlers only for things that genuinely need a stable HTTP endpoint (webhooks, external integrations).
- Components in `packages/ui` must not import anything Supabase-specific — they take data via props, stay backend-agnostic.
- Commit messages describe what actually changed in this repo, not aspirational features.

## What NOT to build right now (v1 non-goals)

No microservices, no Redis/RabbitMQ, no mobile app, no AI/LLM quest generation, no social/guild features, no payments, no blockchain/NFT anything. These are Phase 3+ wishlist items (mined from the PDF) and only get built if there's a concrete reason post-launch. If a request seems to be asking for one of these, flag it rather than silently scaffolding infrastructure for a non-goal.

## Before marking a phase exit criterion met

Re-read the exit criteria in `MASTERPLAN.md` for the current phase. Don't move to next-phase tasks until the current phase's stated exit check is actually true end-to-end (not just "the code compiles").
