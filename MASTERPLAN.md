# GrowthMate — Masterplan

**Status:** Pre-build. Repo currently contains only a vanilla HTML/CSS/JS prototype + README. This document plans the Next.js rebuild from zero.

**Owner:** Sumit Kolgire (solo, active priority)

---

## 1. What GrowthMate actually is right now

Before planning forward, here's the honest baseline — no inflated history, no invented user numbers:

- **Existing artifact:** a single-page vanilla JS app (`app.js`, ~2,800 lines, no framework) called "Solo Leveling: Developer Growth System."
- **What it does:** an 8-step skill assessment wizard → calculates 6 stats (Productivity, Creativity, Knowledge, Experience, Intelligence, Resilience) using hand-rolled math (sigmoid, tanh, Shannon entropy, geometric mean) → generates a dashboard with quests, a skill tree, a marketplace, and Chart.js radar/line charts.
- **What it does NOT have:** any backend, any database, any auth, any persistence (state lives in a JS object and resets on reload), and zero real users. The README's claims of MongoDB/Express/AWS/Stripe/GDPR pipelines are *roadmap copy*, not built infrastructure.
- **There is also a separate "GrowthMate Solo Leveling System" PDF report** describing a fictional 50,000-user habit-tracker product (penalty system exploits, guild infrastructure, P0 bug backlogs, $500K revenue targets). This is **not real project history** — it reads as an aspirational case-study document. We treat it strictly as a **feature/idea backlog** to selectively mine, not as a system we're migrating off of or a track record we report.

**Conclusion:** we are not "migrating" or "upgrading" an existing production system. We are doing a **ground-up rebuild**, reusing the *domain logic and feature ideas* from the prototype, in a real Next.js + Supabase stack, starting from an empty `apps/` and `packages/` tree.

---

## 2. Product definition (rebuilt scope)

**GrowthMate** is a gamified personal/career growth tracker — "Solo Leveling for real life." A user completes an assessment, gets a starting character with stats and a rank, then earns XP by completing real quests (habits/tasks they define or pick from templates), leveling up, unlocking skill trees, and spending in-app currency on real-world rewards they configure.

**Core loop (v1, must work end-to-end):**
1. Sign up / log in (Supabase Auth)
2. Onboarding assessment → initial stats + level calculated server-side
3. Dashboard: stats, level/rank, XP bar, daily quests
4. Complete a quest → XP/gold awarded → stats updated → possible level-up
5. Everything persists across sessions and devices (Postgres via Supabase)

Everything past that (skill trees, marketplace, social/guilds, AI quest generation) is **v2+** and explicitly deferred — see Section 5.

---

## 3. Architecture

### 3.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, React 19 | Matches your NovelMan stack; SSR for dashboard, RSC for data-heavy pages |
| Styling | TailwindCSS | Fast iteration, matches your other projects |
| Backend | Supabase (Postgres + Auth + Storage + Row Level Security) | Free tier, no separate Express/NestJS service needed for v1 — fewer moving parts for a solo dev |
| State (client) | Zustand (lightweight) for UI/session state; React Query (TanStack Query) for server state/caching | Avoids over-engineering with Redux for a single-user-scoped app |
| Charts | Recharts (replaces Chart.js — better React/SSR fit) | |
| Hosting | Vercel (frontend) + Supabase Cloud (DB/auth) | Both have generous free tiers |
| Monorepo tool | Turborepo | Already decided; lets `apps/web` and shared `packages/*` (types, ui, game-logic) live together |

**Explicitly NOT in v1:** separate NestJS API, Redis, RabbitMQ, microservices, mobile app, AI/LLM service. These were artifacts of the fictional PDF scale-out story — add them only if/when real usage demands it.

### 3.2 Monorepo layout

```
growthmate/
├── apps/
│   └── web/                      # Next.js 15 app (App Router)
│       ├── app/
│       │   ├── (auth)/login, /signup
│       │   ├── (onboarding)/assessment
│       │   ├── (app)/dashboard, /quests, /skill-tree, /progress, /settings
│       │   ├── api/                # Next.js route handlers (thin; logic lives in packages/game-logic)
│       │   └── layout.tsx
│       ├── components/             # App-specific UI composition
│       └── lib/                    # supabase client, auth helpers
├── packages/
│   ├── game-logic/                 # PORTED from app.js — pure functions, fully unit-testable
│   │   ├── stats.ts                 # calculateProductivity, calculateCreativity, etc.
│   │   ├── leveling.ts               # getXPForLevel, getRankingInfo
│   │   ├── quests.ts                  # quest pools, generation logic
│   │   └── math-utils.ts               # sigmoid, tanh, entropy, geometricMean
│   ├── database/                    # Supabase schema, migrations, generated types
│   │   ├── schema.sql
│   │   └── types.ts                  # generated via `supabase gen types`
│   ├── ui/                           # Shared React components (stat bars, quest cards)
│   ├── config/                        # eslint, tsconfig, tailwind presets shared across apps
│   └── types/                          # Shared TS types (Quest, UserStats, etc.)
├── turbo.json
├── package.json
├── CLAUDE.md
└── README.md
```

### 3.3 Data model (v1, Supabase/Postgres)

```sql
-- users handled by Supabase Auth (auth.users)

profiles (
  id uuid references auth.users primary key,
  name text,
  avatar text,
  level int default 1,
  xp int default 0,
  gold int default 100,
  engagement int default 50,
  energy int default 70,
  created_at timestamptz default now()
)

stats (
  profile_id uuid references profiles(id) primary key,
  productivity int, creativity int, knowledge int,
  experience int, intelligence int, resilience int,
  updated_at timestamptz default now()
)

quests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  title text, description text,
  category text,              -- daily | weekly | monthly | challenge
  rank text,                  -- E/D/C/B/A/S
  xp_reward int, gold_reward int,
  stats_affected text[],
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
)

assessment_responses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  raw_answers jsonb,
  computed_stats jsonb,
  created_at timestamptz default now()
)
```

Row Level Security: every table scoped to `auth.uid() = profile_id`. No service-role bypass needed for v1.

### 3.4 What gets ported vs. rewritten from `app.js`

| Prototype code | Action |
|---|---|
| `calculateProductivityAdvanced`, `calculateCreativityAdvanced`, etc. | **Port as-is into `packages/game-logic/stats.ts`**, typed, unit tested. This is genuinely good, self-contained domain logic — no reason to rewrite the math. |
| `getXPForLevel`, `getRankingInfo` | **Port as-is.** |
| `questPools`, `rankUpQuests`, `achievementDefinitions` | **Port as seed data** → move into `packages/database` as seed SQL or a constants file consumed by both seed script and UI. |
| DOM string-templating (`renderDashboard()` returning HTML strings) | **Discard.** Rebuilt as actual React components. |
| `appState` global object | **Discard.** Replaced by Supabase tables + React Query cache + Zustand for ephemeral UI state. |
| `showModal()` / vanilla modal system | **Discard.** Replaced with a proper component (e.g. Radix Dialog or shadcn/ui Dialog). |
| Chart.js radar/line charts | **Rewrite in Recharts** for React-native rendering (no manual `setTimeout(renderCharts, 100)` hacks needed). |

---

## 4. Phased build plan

### Phase 0 — Foundation (Week 1)
- Turborepo scaffold: `apps/web`, `packages/game-logic`, `packages/database`, `packages/types`, `packages/ui`, `packages/config`
- Next.js 15 app router skeleton, Tailwind configured
- Supabase project created, schema above migrated, RLS policies written
- Supabase Auth wired (email/password + optionally GitHub OAuth, since you're a dev-focused audience)
- `packages/game-logic` populated by porting the prototype's calculation functions, each with a Vitest unit test

**Exit criteria:** can sign up, log in, log out. Empty dashboard renders behind auth.

### Phase 1 — Core loop (Weeks 2–3)
- Assessment flow (port the 8-step wizard as React form steps + Zod validation, replacing raw `getElementById` reads)
- On submit: call `packages/game-logic` stat calculators server-side (Next.js Server Action), write `profiles` + `stats` + `assessment_responses`
- Dashboard: stat bars, level/rank display, XP bar — pulling from Supabase via React Query
- Daily quest generation (port `questPools` + `generateDailyQuests` logic) — quests inserted into `quests` table
- Quest completion → XP/gold/stat updates via Server Action, with optimistic UI update

**Exit criteria:** a user can complete onboarding, see their dashboard, complete a quest, see XP/level update, refresh the page, and have it all still be there.

### Phase 2 — Engagement layer (Weeks 4–5)
- Level-up modal with stat point allocation (ported from prototype, rebuilt as a controlled React form)
- Achievements (port `achievementDefinitions`, evaluate server-side on quest completion)
- Progress page: Recharts radar chart (6 stats) + XP-over-time line chart, sourced from real completed-quest history (not the prototype's last-10-quests hack)
- Streak tracking (daily login/check-in logic, stored properly with timezone handling — the prototype's `new Date().toDateString()` approach is timezone-fragile; fix this in the rebuild)

**Exit criteria:** returning daily feels rewarding; charts reflect real history.

### Phase 3 — Selected features from the PDF wishlist (Weeks 6+)
Pick from this backlog based on actual user feedback once you have a few real users — don't build all of it speculatively:
- Skill tree (visual unlock tree, the prototype already has a reasonable data shape for this)
- Multi-difficulty quests (Easy/Medium/Hard scaling — concept from the PDF, cheap to implement)
- Marketplace (spend gold on user-defined real-world rewards — prototype already has UI logic to port)
- Weekly/monthly objectives in addition to daily

**Deliberately deferred indefinitely unless there's real demand:** guilds/social features, AI-generated quests via LLM API, mobile apps, wearable integrations, blockchain/NFT anything, predictive analytics. These came from the fictional PDF's "50k user scale-out" narrative and add real infra cost/complexity that isn't justified pre-launch.

---

## 5. Explicit non-goals for v1

- No microservices, no separate backend service — Next.js + Supabase is enough until there's a concrete reason otherwise
- No social/multiplayer features
- No AI/LLM-generated content (quest generation stays template-based, like the prototype)
- No mobile app (responsive web only)
- No payments/monetization
- No claims of existing users, uptime SLAs, or production scale in any public-facing material — this is a personal project in active early build

---

## 6. Open decisions to make before/during Phase 0

- [ ] OAuth providers for Supabase Auth (GitHub only, or +Google)?
- [ ] Domain/hosting name for the Vercel deployment
- [ ] Whether `packages/game-logic` stat formulas stay as-is or get simplified (the prototype's math is elaborate — e.g. 5-component weighted Productivity score — worth sanity-checking against real assessment answers once a few real users go through it)
