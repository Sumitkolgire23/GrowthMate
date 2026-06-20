# GrowthMate

> Turn real-world habits and goals into an RPG-style progression system. Solo Leveling, but for your actual life.

**Status: 🚧 Active rebuild in progress.** GrowthMate started as a vanilla-JS prototype and is being rebuilt from scratch as a Next.js 15 + Supabase application. This README describes the current rebuild target — see [Project status](#project-status) below for what's actually working today.

---

## What is GrowthMate?

GrowthMate is a gamified personal development tracker. You complete a short assessment, get a starting character with six stats (Productivity, Creativity, Knowledge, Experience, Intelligence, Resilience) and a rank (F → S), then earn XP and gold by completing quests — real habits and tasks you define. Level up, watch your stats grow, and track progress over time.

Core loop:
1. **Assess** — answer questions about your skills, habits, and goals
2. **Get your character** — stats and starting level calculated from your answers
3. **Complete quests** — daily/weekly tasks tied to specific stats
4. **Level up** — gain XP, allocate stat points, climb the rank ladder
5. **Track progress** — charts showing stat growth and XP history over time

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | TailwindCSS |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Client state | TanStack Query + Zustand |
| Charts | Recharts |
| Validation | Zod |
| Testing | Vitest |
| Hosting | Vercel + Supabase Cloud |

## Project structure

```
growthmate/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── game-logic/       # Stat calculation, leveling, quest generation (pure TS, unit tested)
│   ├── database/         # Supabase schema + generated types
│   ├── ui/                # Shared React components
│   ├── types/               # Shared TypeScript types
│   └── config/                # Shared lint/tsconfig/tailwind config
```

## Getting started

### Prerequisites
- Node.js ≥ 20
- pnpm (or your preferred package manager — adjust commands below accordingly)
- A free [Supabase](https://supabase.com) project

### Setup

```bash
git clone https://github.com/Sumitkolgire23/GrowthMate-LevelingUp-System.git
cd GrowthMate-LevelingUp-System
pnpm install
```

Create `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Apply the database schema (see `packages/database/schema.sql`) via the Supabase SQL editor or CLI.

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

### Running tests

```bash
pnpm test   # runs Vitest across packages, primarily packages/game-logic
```

## Project status

This project is being actively rebuilt. Rather than list features as if they exist, here's the honest state:

- [ ] Monorepo scaffold
- [ ] Supabase schema + auth
- [ ] Assessment flow
- [ ] Dashboard (stats, level, XP)
- [ ] Quest system (generation + completion)
- [ ] Level-up + stat allocation
- [ ] Achievements
- [ ] Progress charts
- [ ] Skill tree
- [ ] Marketplace

See `MASTERPLAN.md` for the full architecture and phased plan, and `TASKLIST.md` for the granular build checklist.

## History

GrowthMate began as a single-file vanilla JavaScript prototype (no framework, no backend, in-memory state only) that proved out the core stat-calculation and quest-loop concepts. That prototype is being ported — its domain logic (stat formulas, XP curves, quest data) is being carried into `packages/game-logic`, while the UI is being rebuilt natively in React/Next.js.

## License

MIT
