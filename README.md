# 📈 Solo‑Leveling Developer Growth System  
**A gamified career‑RPG platform that turns your skill‑development journey into a leveling‑up adventure.**  

> **Live Demo** → [`https://solo‑leveling.dev`](#)   

---  

## Table of Contents  

| # | Section | Anchor |
|---|---------|--------|
| 1️⃣ | [Project Overview](#1️⃣-project-overview) | `#project-overview` |
| 2️⃣ | [Key Features](#2️⃣-key-features) | `#key-features` |
| 3️⃣ | [Architecture Diagram](#3️⃣-architecture-diagram) | `#architecture-diagram` |
| 4️⃣ | [Tech Stack](#4️⃣-tech-stack) | `#tech-stack` |
| 5️⃣ | [Getting Started (Local)](#5️⃣-getting-started-local) | `#getting-started-local` |
| 6️⃣ | [Running the Full‑Stack (Production‑Ready)](#6️⃣-running-the-full‑stack-production‑ready) | `#running-the-full‑stack-production‑ready` |
| 7️⃣ | [Security & Compliance](#7️⃣-security‑compliance) | `#security‑compliance` |
| 8️⃣ | [Development Workflow](#8️⃣-development-workflow) |
| 9️⃣ | [Contributing](#9️⃣-contributing) |
| 🔟 | [Roadmap & Milestones](#10️⃣-roadmap‑milestones) |
| 📜 | [License](#📜-license) |
| 🙏 | [Acknowledgements](#🙏-acknowledgements) |

---  

## 1️⃣ Project Overview  

The **Solo‑Leveling Developer Growth System** (SL‑DGS) is a **single‑page React dashboard** that visualises a full career‑progression pipeline:

* **RPG‑style stats** – 6 core attributes + derived Engagement & Energy.  
* **Dynamic skill‑tree** – Unlock tech, soft‑skill, certification & project nodes.  
* **Quest engine** – Daily, weekly & challenge quests drive XP.  
* **AI‑assistant (ARIA)** – Conversational coach that suggests learning paths, resources & career moves.  
* **Growth Marketplace** – Curated 100 + courses, tools & certifications.  

All of this is currently **client‑only** (localStorage‑backed) but the repo contains a **complete roadmap** toward a production‑ready SaaS (backend, auth, GDPR, payments, monitoring, etc.).

---  

## 2️⃣ Key Features  

| 🏅 | Feature | Status | Demo |
|---|----------|--------|------|
| **📊** | 8‑step Assessment Wizard → real‑time stat calculation (sigmoid, tanh, entropy) | ✅ Completed (v2.1) | ![assessment‑demo](https://user-images.githubusercontent.com/placeholder/assessment.gif) |
| **⚔️** | 6‑stat system + Resilience, Engagement, Energy | ✅ Completed | ![stats‑demo](https://user-images.githubusercontent.com/placeholder/stats.gif) |
| **🗺️** | Hierarchical Skill Tree / Arsenal | ✅ Completed | ![skill‑tree‑demo](https://user-images.githubusercontent.com/placeholder/skilltree.gif) |
| **🚀** | Quest system (Daily / Weekly / Challenge) | ✅ Completed | ![quests‑demo](https://user-images.githubusercontent.com/placeholder/quests.gif) |
| **🤖** | ARIA Conversational Chat (UI mock – backend pending) | ✅ UI | ![aria‑demo](https://user-images.githubusercontent.com/placeholder/aria.gif) |
| **🛒** | Growth Marketplace (4 categories) | ✅ Completed | ![market‑demo](https://user-images.githubusercontent.com/placeholder/marketplace.gif) |
| **📈** | Radar & XP History charts (Canvas) | ✅ Completed | ![charts‑demo](https://user-images.githubusercontent.com/placeholder/charts.gif) |
| **🔐** | Encrypted LocalStorage (XOR + Base64 – to be replaced) | ✅ Completed | — |
| **⚙️** | Full‑screen responsive UI, glass‑morphism design | ✅ Completed | — |

> **All “Demo” GIFs are placeholders – replace with real recordings when you ship the next iteration.**  

---  

## 3️⃣ Architecture Diagram  

```mermaid
flowchart TD
    subgraph FE[Frontend – Next.js (React 19)]
        UI[UI Components] -->|fetch| API[API Layer (Axios)]
        UI -->|store| Store[Global State (Zustand/Redux)]
        UI -->|render| Charts[Canvas Radar / XP]
        UI -->|chat| ARIA[ARIA Chat UI]
    end

    subgraph BE[Backend – Express Node 20]
        Auth[JWT Auth]
        DB[MongoDB (Mongoose)]
        AI[AI Service (OpenAI / Llama‑2)]
        Q[Quest Engine] --> DB
        S[Skill‑Tree Service] --> DB
        M[Marketplace Service] --> DB
        U[User Profile Service] --> DB
    end

    subgraph Infra[Infrastructure]
        Vercel[Frontend – Vercel] 
        Railway[Backend – Railway] 
        S3[Static Assets CDN] 
        Redis[Redis Queue] 
        Sentry[Error Monitoring] 
        Grafana[Metrics & Alerts] 
    end

    UI -->|SSR / API Routes| Vercel
    API --> Railway
    AI --> Redis
    Railway --> DB
    Railway --> Sentry
    Railway --> Grafana
    Vercel --> S3
    style FE fill:#4F46E5,stroke:#6366F1,color:#fff
    style BE fill:#10B981,stroke:#34D399,color:#fff
    style Infra fill:#F59E0B,stroke:#FBBF24,color:#fff
```

*The diagram above is **live‑rendered** by GitHub’s Mermaid support. Feel free to edit the nodes, rename services, or add more layers.*  

---  

## 4️⃣ Tech Stack  

| Layer | Primary Libraries | Rationale |
|-------|-------------------|-----------|
| **Frontend** | React 19, Next.js 15, TypeScript, TailwindCSS, React‑Query, Zustand/Redux Toolkit, Canvas API | Modern SPA with server‑side rendering, type safety & fast styling |
| **Backend** | Express 20, TypeScript, Mongoose (MongoDB), JWT, Bcrypt, Helmet, Rate‑Limit, BullMQ (Redis) | Light‑weight, extensible REST API; easy to spin up in Railway / Render |
| **AI** | OpenAI `gpt‑4o` (or self‑hosted Llama‑2) via Fastify micro‑service | Centralised LLM calls, queue‑based to avoid latency spikes |
| **Database** | MongoDB Atlas (or self‑hosted) + Mongoose schemas | Flexible document model for dynamic skill‑tree & quest data |
| **Auth** | JWT + HttpOnly cookies, Refresh‑token flow | Stateless, scalable and works across browsers |
| **CI/CD** | GitHub Actions → Lint (ESLint/Prettier) → Tests (Jest/React‑Testing‑Library) → Build (Next) → Deploy (Vercel/Railway) | Automated quality gates |
| **Monitoring** | Sentry (frontend & backend), Prometheus + Grafana, LogRocket | Real‑time error & performance visibility |
| **Payments** | Stripe (Checkout + Subscriptions) | PCI‑DSS‑compliant SaaS billing |
| **Compliance** | Cookie‑Consent (OneTrust), GDPR DSAR endpoints, OWASP Helmet, CSP, Referrer‑Policy | Legal‑ready from day 1 |

---  

## 5️⃣ Getting Started (Local)  

> **Prerequisites** – Node ≥ 20, npm ≥ 10, Docker (optional for DB), Git  

### 5.1 Clone the repo  

```bash
git clone https://github.com/your‑org/solo‑leveling-dev.git
cd solo‑leveling-dev
```

### 5.2 Install dependencies  

```bash
# Front‑end (Next.js)
cd ui
npm ci          # installs exact lockfile versions
npm run dev     # http://localhost:3000

# Backend (Express)
cd ../api
npm ci
npm run dev     # http://localhost:4000/api
```

### 5.3 Run a local MongoDB (Docker)  

```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  --name sl-dgs-db \
  mongo:7
```

Update `.env` in the `api` folder:

```dotenv
PORT=4000
MONGODB_URI=mongodb://admin:secret@localhost:27017/solo-leveling?authSource=admin
JWT_SECRET=super‑secret‑jwt‑key
AES_KEY=32‑byte‑hex‑key‑for‑aes‑256
```

### 5.4 Test the dashboard  

Open `http://localhost:3000` → you should see the **Project Progress Dashboard** with the collapsible version history. All data is persisted to **encrypted LocalStorage** for now.

---  

## 6️⃣ Running the Full‑Stack (Production‑Ready)  

The following script sets up the **complete stack** (frontend, backend, AI micro‑service, Redis, MongoDB) using **Docker Compose**.  

```yaml
# docker-compose.yml
version: "3.9"

services:
  mongo:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"

  api:
    build: ./api
    env_file:
      - ./api/.env.prod
    depends_on:
      - mongo
      - redis
    ports:
      - "4000:4000"

  ai-service:
    build: ./ai-service
    env_file:
      - ./ai-service/.env
    depends_on:
      - redis
    ports:
      - "5000:5000"

  web:
    build: ./ui
    env_file:
      - ./ui/.env.production
    depends_on:
      - api
    ports:
      - "3000:3000"

volumes:
  mongo-data:
```

### Deploy steps  

```bash
# 1️⃣ Build & start everything
docker compose up -d --build

# 2️⃣ Run migrations / seed data (once)
docker exec -it solo_leveling_dev-api npm run seed

# 3️⃣ Access services
#   Frontend → http://localhost:3000
#   API      → http://localhost:4000/api/v1/health
#   AI       → http://localhost:5000/health
```

### Production Hosting  

| Component | Recommended Provider | Why |
|-----------|---------------------|-----|
| Frontend  (Next.js) | **Vercel** (or Netlify) | Edge‑rendered, zero‑config, automatic preview URLs |
| Backend    (Express)  | **Railway** or **Render** | Managed container, free‑tier for dev, automatic SSL |
| Database   (MongoDB)   | **MongoDB Atlas** | Managed backups, auto‑scaling, built‑in security |
| Redis      (queue)    | **Upstash** (serverless) | Pay‑as‑you‑go, simple env‑var integration |
| AI Service | **Fly.io** (if self‑hosted) or **OpenAI** (hosted) | Low‑latency edge nodes, easy API keys |
| Monitoring | **Sentry** (frontend + backend) | Real‑time error grouping, source‑maps |
| Billing    | **Stripe** (Checkout) | PCI‑DSS validated, subscription life‑cycle APIs |

---  

## 7️⃣ Security & Compliance  

| Area | Current Implementation | Production Upgrade |
|------|------------------------|--------------------|
| **Data at Rest** | XOR + Base64 (client only) | **AES‑256‑GCM** via Web Crypto API (client) + server‑side encryption |
| **Authentication** | None (demo) | **JWT + Refresh‑Token**, HttpOnly cookies, Bcrypt password hashing |
| **Authorization** | UI‑only gating | Role‑based ACL (user, admin, premium) |
| **CSRF / XSS** | Basic sanitisation (DOMPurify) | **Helmet**, CSP, `strict‑transport‑security`, global XSS sanitiser |
| **Rate Limiting** | Not applied | `express-rate-limit` + Redis store |
| **GDPR / CCPA** | Policy pages only | **Cookie Consent banner**, DSAR endpoints (`/api/v1/users/me/data`), data‑retention schedules |
| **Logging** | Console.log (dev) | **Winston** → JSON logs → Loki → Grafana |
| **Backup** | None | MongoDB Atlas automated snapshots + daily S3 export |
| **Pen‑Testing** | None | Quarterly OWASP ZAP scan, third‑party security audit before launch |

> **Checklist before launch** – run `npm run security-audit` (script runs `npm audit`, `zaproxy`, `snyk`) and fix all **high/critical** findings.  

---  

## 8️⃣ Development Workflow  

```mermaid
flowchart TB
    subgraph LocalDev[Local Development]
        direction LR
        FE[Frontend] -->|Hot‑reload| Vite[Next Dev Server]
        BE[Backend] -->|nodemon| Node[Express Dev Server]
        AI[AI Service] -->|watch| Fastify[Fastify Dev]
    end

    subgraph CI[GitHub Actions CI]
        Lint[🧹 Lint & Format]
        Test[🧪 Unit / Integration Tests]
        Build[📦 Build Artifacts]
        Deploy[🚀 Deploy to Staging]
    end

    LocalDev --> Lint --> Test --> Build --> Deploy
```

### Branching Model  

| Branch | Purpose |
|--------|----------|
| `main` | Production‑ready code (always deployable). |
| `develop` | Next‑release integration branch. |
| `feature/*` | New feature work – PR into `develop`. |
| `hotfix/*` | Critical fixes – PR into `main` & `develop`. |
| `release/*` | Release candidate – after QA, merge to `main`. |

### Scripts (package.json)  

| Script | What it does |
|--------|--------------|
| `npm run dev` | Starts **frontend** (`next dev`) & **backend** concurrently via `concurrently`. |
| `npm run lint` | Runs ESLint + Prettier (fixes). |
| `npm run test` | Jest + React‑Testing‑Library coverage (>80%). |
| `npm run build` | Produces production bundles (`next build`). |
| `npm run start` | Runs **compiled** frontend (`next start`) + backend (`node dist`). |
| `npm run security-audit` | `npm audit`, `snyk test`, `zaproxy` scan. |

---  

## 9️⃣ Contributing  

We welcome contributions – whether it’s a UI polish, a new quest, or a backend optimisation.  

1. **Fork** the repository.  
2. Create a **feature branch** (`git checkout -b feature/awesome‑quest`).  
3. Follow the **code style** – ESLint (recommended config), TypeScript strict mode, and Tailwind JIT.  
4. Write **unit tests** for any new logic (≥ 80 % coverage).  
5. Run the full test suite: `npm run test`.  
6. Submit a **Pull Request** with a clear description and a link to the related issue.  

> **Help wanted** – see the `issues` tab for open tickets tagged `good first issue`.  

---  

## 10️⃣ Roadmap & Milestones  

| Milestone | Target | Description |
|-----------|--------|-------------|
| **M1 – Backend Core** | **4 weeks** | JWT auth, user CRUD, quest & skill‑tree APIs, MongoDB schema finalisation. |
| **M2 – AI Integration** | **3 weeks** | Deploy ARIA micro‑service, implement recommendation endpoints, queue handling. |
| **M3 – Security Harden** | **2 weeks** | AES‑256 encryption, CSP, rate‑limiting, GDPR consent banner. |
| **M4 – DevOps & Monitoring** | **2 weeks** | Docker + CI/CD pipelines, Sentry + Grafana dashboards, automated backups. |
| **M5 – Payments & Subscriptions** | **3 weeks** | Stripe Checkout, tiered plans, usage‑based limits, admin dashboard. |
| **M6 – Public Beta** | **4 weeks** | Invite‑only rollout, collect feedback, iterate on quests & UI. |
| **M7 – GA Launch** | **6 weeks** | Full SaaS, marketing site, onboarding flow, support docs. |

> **Projected launch:** Q3 2026 (subject to resource allocation).  

---  

## 📜 License  

```text
MIT License

Copyright (c) 2024‑2026 Solo‑Leveling Dev Team

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

Full license file lives in `LICENSE`.  

---  

## 🙏 Acknowledgements  

* **lucide-react** – beautiful open‑source icons.  
* **Next.js** – powerful React framework.  
* **Express** – minimal yet extensible back‑end.  
* **OpenAI** – LLM power behind ARIA.  
* **TailwindCSS** – rapid UI styling.  

Special thanks to the open‑source community for the many algorithms (sigmoid, entropy, geometric mean) that power our stat calculations.  

---  

> **Want to level‑up together?**  
> 👉 Star ⭐ the repo, open an issue, or join the Discord channel (link in `README.md`).  

---  
