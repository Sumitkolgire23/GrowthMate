# GrowthMate

> Turn real-world habits and goals into an RPG-style progression system. Solo Leveling, but for your actual life.

**Status: 🎉 Core Rebuild Completed.** GrowthMate has been rebuilt from a vanilla JS prototype into a modern, 100% self-hosted, local-first Next.js 15 Monorepo with a SQLite database, Prisma ORM, and custom cryptographic session cookie auth (zero external service dependencies).

---

## Features
1. **Awaken Character Onboarding:** Take a personal assessment and receive your starting stats, rank, and class calculated via custom entropy and sigmoid formulas.
2. **Daily Quests:** Real-life habits generated as RPG quests. Complete them with low/medium/high/extreme effort options for dynamic XP/Gold multiplier scaling.
3. **Progress Analytics:** Beautiful radar and line charts tracking your historical stat growth and daily XP gain.
4. **Interactive Skill Tree:** Unlock intermediate and advanced skills along paths like Web Development and AI/ML, using earned Gold and unlocking prerequisites.
5. **Growth Marketplace:** Spend your gold on real-world rewards (e.g. Udemy vouchers, rest days, mock interviews) with atomic transaction protection.
6. **Custom Local Auth:** Highly secure custom session cookies and PBKDF2 password hashing requiring zero cloud setup.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | Turborepo |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Vanilla CSS + TailwindCSS (curated high-contrast dark cyberpunk themes) |
| **Database** | SQLite + Prisma ORM (local file-based storage) |
| **Authentication** | Custom Session Cookies + PBKDF2 hashing (Node `crypto` module) |
| **State Management** | TanStack Query + Zustand |
| **Charts** | Recharts |
| **Testing** | Vitest |

---

## Project Structure

```
growthmate/
├── .github/workflows/    # CI pipelines (GitHub Actions)
├── apps/
│   └── web/              # Next.js web application (Runs on port 3100)
├── packages/
│   ├── game-logic/       # Math utility, leveling curves, and quest generation (pure TS, tested)
│   ├── database/         # Prisma schema, migrations, and typed Prisma Client singleton
│   ├── ui/               # Shared frontend design components
│   ├── types/            # Shared TypeScript interfaces
│   └── config/           # Shared lint/tsconfig/tailwind configuration
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm (Recommended)

### Setup & Local Run

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Sumitkolgire23/GrowthMate.git
   cd GrowthMate
   ```

2. **Install Dependencies**
   ```bash
   pnpm install --ignore-scripts
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file inside the `apps/web` folder:
   ```env
   SESSION_SECRET="your-32-character-random-session-secret"
   ```

4. **Initialize local SQLite database & run migrations**
   ```bash
   pnpm --filter @repo/database exec prisma migrate dev --name init
   ```

5. **Start Dev Server**
   ```bash
   pnpm dev
   ```
   The application will start on **`http://localhost:3100`**.

---

## Running Tests

Verify game logic curves and leveling algorithms:
```bash
pnpm --filter @repo/game-logic test
```

---

## CI/CD Pipeline

The project includes a GitHub Actions CI pipeline (`.github/workflows/ci.yml`) that triggers on push/PR to `main`. It automatically:
- Installs dependencies using `pnpm`
- Generates Prisma Client types
- Validates the codebase using TypeScript compiler check (`tsc --noEmit`)
- Runs the test suite via Vitest

---

## License

MIT
