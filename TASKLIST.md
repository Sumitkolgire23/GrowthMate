# GrowthMate — Master Task List

Sequenced for solo, daily-active execution. Check off as you go. Each phase has an exit criteria in MASTERPLAN.md — don't move to the next phase until it's met.

---

## Phase 0 — Foundation

### Repo & tooling
- [ ] `npx create-turbo@latest growthmate` (or manually scaffold if you want full control)
- [ ] Set up `apps/web` as Next.js 15 app (App Router, TypeScript, Tailwind via `create-next-app`)
- [ ] Create `packages/game-logic`, `packages/database`, `packages/types`, `packages/ui`, `packages/config`
- [ ] Configure `packages/config` with shared `tsconfig.base.json`, `.eslintrc`, `tailwind.config` preset
- [ ] Wire `turbo.json` pipelines (`build`, `dev`, `lint`, `test`)
- [ ] Push initial scaffold to GitHub, confirm CI-less local builds work (`turbo dev`, `turbo build`)

### Supabase setup
- [ ] Create Supabase project (free tier)
- [ ] Write `packages/database/schema.sql` (profiles, stats, quests, assessment_responses — see MASTERPLAN §3.3)
- [ ] Apply schema via Supabase SQL editor or CLI migration
- [ ] Write RLS policies: every table restricted to `auth.uid() = profile_id`
- [ ] Generate TypeScript types: `supabase gen types typescript` → `packages/database/types.ts`
- [ ] Set up `apps/web/lib/supabase/client.ts` (browser client) and `server.ts` (server client for RSC/Server Actions)
- [ ] `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, document in README

### Auth
- [ ] Build `/login` and `/signup` pages (email/password via Supabase Auth)
- [ ] Add auth middleware (`apps/web/middleware.ts`) to protect `(app)/*` routes
- [ ] Confirm: sign up → session persists → logout works → protected routes redirect when logged out

### Port game logic
- [ ] Create `packages/game-logic/src/math-utils.ts` — port `sigmoid`, `tanh`, `exponentialDecay`, `logGrowth`, `geometricMean`, `normalize`, `shannonEntropy`, `calculateConfidence` from `app.js`
- [ ] Create `packages/game-logic/src/stats.ts` — port all 6 `calculate*Advanced` functions, typed with a proper `AssessmentData` interface (replace the loose untyped object in the prototype)
- [ ] Create `packages/game-logic/src/leveling.ts` — port `getXPForLevel`, `getRankingInfo`
- [ ] Create `packages/game-logic/src/quests.ts` — port `questPools`, `rankUpQuests`, `achievementDefinitions`, `generateDailyQuests`/`generateWeeklyQuests`/etc.
- [ ] Write Vitest unit tests for every ported function (use realistic input ranges; the prototype has zero tests today)
- [ ] **Exit check:** `pnpm test` passes in `packages/game-logic` with no dependency on DOM or browser globals

---

## Phase 1 — Core loop

### Assessment flow
- [ ] Build `app/(onboarding)/assessment/page.tsx` as a multi-step client component (8 steps, port content from `renderAssessmentStep` in `app.js`)
- [ ] Replace manual `getElementById` value-reading with React state + Zod schema validation per step
- [ ] On final step submit → Server Action that calls `packages/game-logic` stat calculators, then inserts into `profiles`, `stats`, `assessment_responses`
- [ ] Redirect to `/dashboard` after successful submission

### Dashboard
- [ ] Build `app/(app)/dashboard/page.tsx` as a Server Component fetching profile + stats via Supabase server client
- [ ] Build stat bar components in `packages/ui` (reusable across dashboard/progress pages)
- [ ] Display level, rank (via `getRankingInfo`), XP bar, gold, streak
- [ ] Set up React Query provider in `apps/web` for client-side cache/mutations layered on top of the initial server-fetched data

### Quests
- [ ] Server Action: `generateDailyQuests(profileId)` — inserts 2-4 quest rows from `questPools.daily`, idempotent per day (don't regenerate if today's quests already exist)
- [ ] Build quest list UI (`packages/ui/QuestCard`), port visual design from prototype's `.quest-card` styles into Tailwind
- [ ] Quest completion: Server Action that marks quest completed, awards XP/gold, updates affected stats (capped at 100), checks for level-up
- [ ] Optimistic UI update on checkbox click (React Query mutation) with rollback on failure
- [ ] **Exit check:** full loop works — sign up → assessment → dashboard → complete quest → XP/level updates → refresh browser → state persists correctly

---

## Phase 2 — Engagement layer

### Level-up & stat allocation
- [ ] Build level-up modal (shadcn/ui Dialog or Radix) triggered when XP crosses threshold
- [ ] Port stat-point allocation UI (+/- buttons, port logic from `showLevelUpModal` in `app.js`) as a controlled React form, persisted via Server Action on confirm

### Achievements
- [ ] Port `achievementDefinitions` into `packages/game-logic`
- [ ] Add `achievements` table (profile_id, achievement_id, earned_at) to schema
- [ ] Server-side check on quest completion / level-up (port `checkAchievements` logic, run server-side not client-side)
- [ ] Achievement unlock toast/modal

### Progress page & charts
- [ ] Install Recharts in `apps/web`
- [ ] Build radar chart component for the 6 stats (replaces Chart.js version)
- [ ] Build XP-over-time line chart sourced from real `quests` completion timestamps (not the prototype's "last 10 quests" placeholder logic)
- [ ] Build `generateDetailedInsights` equivalent — keep the personalized text generation logic, port from `app.js`, move to a pure function in `packages/game-logic` so it's testable

### Streaks
- [ ] Fix the prototype's timezone-fragile streak logic — store `last_checkin_date` as a date (not relying on browser `toDateString()`), compute streak server-side
- [ ] Daily check-in mechanism (could be implicit on first quest completion of the day, or explicit button)

**Exit check:** returning user sees accurate stats/charts reflecting real completed-quest history; streak survives timezone edge cases.

---

## Phase 3 — Wishlist features (pick based on real feedback, don't build all speculatively)

- [ ] Skill tree page (port `skillTreeData` structure + `renderSkillTree`/`renderSkillTier` as React components)
- [ ] Multi-difficulty quests (Easy/Medium/Hard XP scaling)
- [ ] Marketplace (port `marketplaceItems` + purchase logic, `buyMarketplaceItem` rewritten as Server Action)
- [ ] Weekly/monthly quest tabs (mostly UI work — data model already supports `category`)

---

## Ongoing / cross-cutting (do throughout, not a separate phase)

- [ ] Write `CLAUDE.md` updates whenever architecture decisions change (keep it current, not retroactive)
- [ ] Keep README's feature list honest — only list what's actually shipped, mark in-progress items clearly
- [ ] No resume/portfolio claims about GrowthMate user counts or scale until there are real numbers to report
- [ ] Add basic error boundaries + loading states per route as you build it (don't batch this at the end)
- [ ] Deploy to Vercel early (Phase 0, after auth works) so you're testing against real infra continuously, not just `localhost`
