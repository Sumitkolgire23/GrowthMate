# CLAUDE.md — GrowthMate

> AI agent context file. Read this before making any changes. This is an instruction set, not documentation.

## Project Identity

GrowthMate is a gamified personal/career growth tracker ("Solo Leveling for real life"). It is a **local-first** Next.js 16 monorepo with SQLite (Prisma ORM) and custom cryptographic session cookie auth. **Zero external service dependencies** — no Supabase, no cloud DB, no third-party auth.

- **Status:** Active early build. No real users yet.
- **Owner:** Sumit Kolgire (solo developer)
- **Planning docs:** `MASTERPLAN.md` (architecture/phases), `TASKLIST.md` (sequenced checklist)

## Critical Ground Truth

- **No real users exist.** Never fabricate user counts, uptime stats, or revenue figures in code, comments, or docs.
- A PDF (`GrowthMate_Solo_Leveling_Report.pdf`) describes a fictional 50K-user version with MongoDB/AWS/guilds/$500K revenue. **That is a feature-idea wishlist, not real history.** If asked to fix a "P0 race condition" or similar from the PDF, clarify before acting — it's a fictional bug.
- The `prototype/` directory contains the original vanilla JS app (`app.js`, ~2800 lines). It is a **reference for domain logic only** — do not extend it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5.9 |
| Styling | TailwindCSS 3.x (dark cyberpunk theme, `slate-950` base) |
| Database | SQLite + Prisma ORM (file: `packages/database/prisma/dev.db`) |
| Auth | Custom session cookies (AES-256-CBC) + PBKDF2 password hashing (Node `crypto`) |
| State | TanStack Query (server state) + Zustand (ephemeral UI state) |
| Charts | Recharts (NOT Chart.js) |
| Icons | Lucide React |
| Validation | Zod |
| Testing | Vitest (game-logic unit tests) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

---

## Essential Commands

```bash
pnpm install --ignore-scripts        # Install all dependencies
pnpm dev                              # Start dev server (port 3100)
pnpm build                            # Production build (all packages)
pnpm --filter @repo/game-logic test   # Run game-logic unit tests
pnpm --filter @repo/database exec prisma migrate dev --name <name>  # New migration
pnpm --filter @repo/database exec prisma generate                    # Regenerate Prisma Client
pnpm --filter web exec tsc --noEmit   # Type check the web app
```

---

## Monorepo Architecture

```
growthmate/
├── apps/web/                    # Next.js 16 app (App Router, port 3100)
│   ├── app/
│   │   ├── (app)/               # Protected routes (dashboard, progress, skill-tree, marketplace, settings)
│   │   ├── (onboarding)/        # Assessment flow
│   │   ├── actions/             # Server Actions (auth, quests, assessment, stats, skills, marketplace)
│   │   ├── login/ & signup/     # Public auth pages
│   │   └── layout.tsx           # Root layout (Geist fonts, dark theme, Providers wrapper)
│   ├── lib/auth/auth-utils.ts   # PBKDF2 + AES-256-CBC crypto utilities
│   └── middleware.ts            # Session cookie auth guard
├── packages/
│   ├── game-logic/              # Pure TS: stat calculators, leveling, quests, marketplace (NO React, NO DOM, NO DB)
│   │   ├── src/                 # math-utils, stats, leveling, quests, marketplace
│   │   └── __tests__/           # Vitest unit tests
│   ├── database/                # Prisma schema, migrations, typed client singleton
│   ├── types/                   # Shared TS interfaces (AssessmentData, CharacterStats, Quest, Achievement)
│   ├── ui/                      # Shared React components (StatBar, QuestCard, Button, Card)
│   ├── eslint-config/           # Shared ESLint rules
│   └── typescript-config/       # Shared tsconfig presets (base, nextjs, react-library)
├── prototype/                   # Old vanilla JS app (reference only, DO NOT modify)
└── turbo.json                   # Pipeline config (build, dev, lint, check-types)
```

---

## Architecture Rules

### Package Boundaries (STRICT)

| Package | CAN import | CANNOT import |
|---|---|---|
| `@repo/game-logic` | `@repo/types` | React, DOM APIs, Prisma, Next.js, any side-effectful module |
| `@repo/ui` | `@repo/types`, React, Lucide, TailwindCSS | Prisma, Server Actions, `@repo/database`, any backend code |
| `@repo/database` | `@prisma/client` | React, Next.js, `@repo/game-logic` |
| `@repo/types` | Nothing (leaf package) | Everything |
| `apps/web` | All `@repo/*` packages | Direct `prototype/` imports |

### Server Actions Pattern

All Server Actions live in `apps/web/app/actions/`. They follow this pattern:

1. Authenticate via `getCurrentUser()` (returns null if no valid session)
2. Validate inputs (Zod where applicable)
3. Call pure `@repo/game-logic` functions for calculations
4. Execute DB writes inside `prisma.$transaction()` for atomicity
5. Return `{ success: boolean, error?: string, ...data }` — never throw to the client

**Rule:** Server Actions must be thin orchestrators. If you're writing math, stat formulas, XP calculations, or quest-generation logic — it belongs in `packages/game-logic` as a pure function with a unit test.

### Auth Flow

- Cookie name: `growthmate_session`
- Encryption: AES-256-CBC with key derived from `SESSION_SECRET` env var via `scrypt`
- Password hashing: PBKDF2 (100,000 iterations, SHA-512, 16-byte random salt)
- Session payload: `{ userId, email }`
- Cookie settings: `httpOnly`, `secure` (prod), `sameSite: lax`, 7-day maxAge
- Middleware (`middleware.ts`) protects `/dashboard`, `/quests`, `/skill-tree`, `/progress`, `/settings`, `/assessment`
- Login/signup pages redirect to `/dashboard` if session exists

### Route Group Conventions

- `(app)/` — Protected routes, wrapped by sidebar layout with character HUD
- `(onboarding)/` — Assessment wizard flow
- Root-level `login/` and `signup/` — Public auth pages

---

## Data Model (Prisma/SQLite)

```
User (1) ──→ (1) Profile ──→ (1) Stats
                    │──→ (many) Quest
                    │──→ (many) AssessmentResponse
                    │──→ (many) UnlockedSkill       [@@unique: profileId + skillName]
                    │──→ (many) UserAchievement      [@@unique: profileId + achievementId]
                    └──→ (many) PurchasedReward
```

- `User.id` → UUID, serves as `Profile.id` (shared PK via 1:1 relation)
- Stats are capped at 0–100 for all six stats
- Quests store `statsAffected` as comma-separated string (e.g., `"productivity,resilience"`)
- Assessment raw answers and computed stats stored as JSON strings in `AssessmentResponse`
- All monetary operations (gold deduction, purchases) use `prisma.$transaction()`

---

## Coding Conventions

### TypeScript
- **Strict mode everywhere.** `strict: true` in base tsconfig.
- **No `any` in `packages/game-logic`.** This is the most critical, reusable package — type it precisely.
- Use `as any` sparingly in `apps/web` — only when Prisma types conflict with component props.
- Import shared types from `@repo/types`, not inline definitions.

### React / Next.js
- Server Components by default. Add `'use client'` only when using hooks, event handlers, or browser APIs.
- Server Actions over API routes. Use `app/api/*` only for webhooks or external integrations.
- `export const dynamic = 'force-dynamic'` on pages that read session cookies.
- Wrap client-side data fetching with TanStack Query (`useQuery` / `useMutation`). Seed initial data from Server Components via props.
- Loading states: use a spinning ring with `SYNCHRONIZING SYSTEM...` text (cyberpunk theme consistency).

### Styling
- TailwindCSS utility classes. No custom CSS files except `globals.css`.
- Dark theme palette: `slate-950` (bg), `slate-900` (surfaces), `cyan-500` (accent), `yellow-500` (gold/rank), `purple-500` (secondary).
- Text hierarchy: `text-slate-100` (primary), `text-slate-400` (secondary), `text-slate-500` (muted).
- Interactive elements: uppercase tracking-wider font-bold text-xs for labels and nav items.
- Use `lucide-react` for icons. Do not introduce other icon libraries.

### Components (`packages/ui`)
- Must accept all data via props — no direct database or auth imports.
- Must be backend-agnostic (no Prisma, no Server Action imports).
- Keep them focused and reusable.

### Database
- All schema changes go through Prisma migrations (`prisma migrate dev`).
- Regenerate Prisma Client after any schema change (`prisma generate`).
- Use transactions for any multi-table write operation.
- Soft deletes are preferred when applicable.
- The global Prisma singleton lives in `packages/database/src/index.ts` — import as `import { prisma } from '@repo/database'`.

### Testing
- All pure functions in `packages/game-logic` must have Vitest unit tests.
- Tests live in `packages/game-logic/__tests__/`.
- Test file naming: `<module>.test.ts` (e.g., `leveling.test.ts`).
- Run tests before marking any game-logic work complete: `pnpm --filter @repo/game-logic test`.

### Git & CI
- Commit messages describe what actually changed — not aspirational features.
- CI pipeline (GitHub Actions) runs on push/PR to `main`: install → prisma generate → tsc --noEmit → vitest.
- Do not merge if CI fails.

---

## Environment Variables

| Variable | Required | Location | Purpose |
|---|---|---|---|
| `SESSION_SECRET` | Yes (prod) | `apps/web/.env.local` | AES-256-CBC session encryption key (32+ chars recommended) |

A hardcoded fallback exists for dev (`g3n3r1c-s3ss10n-s3cr3t-growthmate-2026`). **Never use the fallback in production.**

---

## What NOT to Build (v1 Non-Goals)

Do not scaffold infrastructure for any of these unless explicitly requested with a concrete rationale:

- ❌ Microservices / separate backend service
- ❌ Redis, RabbitMQ, message queues
- ❌ Mobile app (responsive web only)
- ❌ AI/LLM quest generation
- ❌ Social/guild/multiplayer features
- ❌ Payments / monetization / blockchain / NFT
- ❌ Supabase Cloud (project uses local SQLite)
- ❌ Express/NestJS API layer

If a request seems to involve one of these, flag it before building.

---

## Common Pitfalls — Do Not Repeat

1. **Port 6000 is reserved.** Next.js blocks it (X11 reserved). Dev server runs on port **3100**.
2. **Do not use Chart.js.** The prototype used it — the rebuild uses **Recharts**.
3. **Do not extend `prototype/app.js`.** Port domain logic into `packages/game-logic`, discard DOM/state code.
4. **Do not create Supabase clients.** This project uses Prisma + SQLite, not Supabase. The MASTERPLAN mentions Supabase as the original plan, but the actual implementation uses local SQLite.
5. **Quest `statsAffected` is a comma-separated string** in the DB, not a JSON array. Split with `.split(',')` when reading.
6. **`getCurrentUser()` is async** and returns `null` on unauthenticated requests. Always null-check before proceeding.
7. **All stat values are capped at 100.** Use `Math.min(100, ...)` on any stat update.
8. **Prisma Client must be regenerated** after schema changes: `pnpm --filter @repo/database exec prisma generate`.

---

## Porting from Prototype

The `prototype/app.js` contains real, usable domain logic (sigmoid/tanh/Shannon entropy/geometric mean stat formulas, XP curves, quest pools). When porting:

| Prototype Code | Action |
|---|---|
| `calculate*Advanced` stat functions | ✅ Port to `packages/game-logic/src/stats.ts` with types + tests |
| `getXPForLevel`, `getRankingInfo` | ✅ Port to `packages/game-logic/src/leveling.ts` |
| `questPools`, `achievementDefinitions` | ✅ Port to `packages/game-logic/src/quests.ts` |
| DOM string-templating (`renderDashboard()`) | ❌ Discard — rebuild as React components |
| Global `appState` object | ❌ Discard — replaced by Prisma + TanStack Query |
| `showModal()` system | ❌ Discard — use proper React dialogs |
| Chart.js setup | ❌ Discard — rebuild in Recharts |

---

## Phase Exit Criteria

Before marking a phase complete, re-read the exit criteria in `MASTERPLAN.md` for that phase. "The code compiles" is not an exit criterion — verify the full end-to-end user flow works.
