# ResilienceAI — Global Supply Chain Risk Intelligence Platform

> **Built at Innovaite 2026 Hackathon**

ResilienceAI is a real-time, multi-agent AI platform that transforms raw geopolitical, climate, economic, and conflict signals into actionable supply chain risk intelligence — across 266 countries.

---

## 🏆 Team AINU

| Name | Email |
|------|-------|
| Aatmaj Amol Salunke | salunke.aa@northeastern.edu |
| Yaksh Ajay Shah | shah.yak@northeastern.edu |
| Smit Nirav Chandi | chandi.s@northeastern.edu |
| Vijwal Mahendrakar | mahendrakar.v@northeastern.edu |
| Gagan Yadav | yadav.gag@northeastern.edu |

---

## ✨ What It Does

Most supply chain tools show you dashboards. ResilienceAI shows you **why** a risk is happening, **which agents concluded it**, and **what cascades next** — powered by a live swarm of AI agents backed by a NVIDIA Blackwell GPU cluster.

---

## 🚀 Key Features

### 🌍 Global Risk Dashboard
- Interactive world map visualizing active risk hotspots across 266 countries
- Real-time composite risk scoring across 6 domains: Conflict, Economy, Weather, Food, Health, Political
- Alert ticker with live threat summaries and trend indicators

### 💬 AI Chat (Multi-Agent Q&A)
- Free-text queries routed to a multi-agent backend — ask anything about global risks
- Transparent **execution trace** showing which agents activated
- Auto-formatted Markdown responses via a dedicated formatter agent

### 🌊 Cascade Simulator
- Describe any scenario in natural language and get an AI-generated cascade risk analysis
- Visualizes how a single disruption propagates through primary → secondary → tertiary effects
- Fully user-driven — no pre-baked scenarios

### 🏛️ Country Deep Dive
- 360° risk profile for any country: radar chart, conflict timeline, weather anomalies, disaster breakdown
- Live AI-generated risk narrative via the agent network
- Powered by real datasets: ERA5 (Climate), EM-DAT (Disasters), GDELT (Conflict), World Bank (Economy)

### 🤖 Agent Network Visualizer
- Live visualization of the multi-agent supervisor orchestration
- See which agents activate in real-time as your query is processed
- Animated graph showing data flow between agents

---

## 🧠 AI Architecture

The backend is a **LangGraph multi-agent system** running on a NVIDIA Blackwell GPU cluster, serving the `google/gemma-3-12b-it` model via an OpenAI-compatible API.

```
User Query
    │
    ▼
┌─────────────────────────────────┐
│         SUPERVISOR AGENT         │  ← Orchestrates & routes queries
└─────────────────────────────────┘
    │        │        │        │
    ▼        ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ News │ │Weath-│ │Econ- │ │ Food │  ... + 4 more
│Stats │ │  er  │ │  omy │ │      │
└──────┘ └──────┘ └──────┘ └──────┘
    │
    ▼
Formatted Response → UI
```

### 8 Specialized Agents

| Agent | Data Source | Focus |
|-------|-------------|-------|
| **Global Tension** | GDELT Event DB | Conflict & news events |
| **Weather/Disaster** | ERA5 Climate, EM-DAT | Climate anomalies & disasters |
| **Economy** | World Bank | GDP, trade flows, economic risk |
| **Food** | FAO Statistics | Crop yields, food security |
| **Political** | Stability Index | Regime stability, governance |
| **Disease** | WHO Data | Outbreak tracking |
| **Health** | Health Capacity DB | Healthcare system resilience |
| **Economic News** | Live Web Search | Real-time market sentiment |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (Turbopack) + **TypeScript**
- Vanilla CSS + **Glassmorphism UI** design system
- **Framer Motion** — animations & transitions
- **Recharts** — risk charts and timelines
- **React Markdown** + **remark-gfm** — AI response rendering

### Backend
- **Next.js Route Handlers** — API layer (`/api/chat`, `/api/stats`, `/api/enrich`, `/api/analyze-country`)
- **FastAPI + Python** — Agent server (`ai_agents/server.py`)
- **LangGraph** — Multi-agent orchestration with `InMemorySaver` checkpointing
- **LangChain Core** — Agent/tool abstractions

### AI / ML
- **Model**: `google/gemma-3-12b-it` served on NVIDIA Blackwell GPU cluster
- **Endpoint**: OpenAI-compatible `/v1/chat/completions` API
- **Context**: 8192 token window with dynamic trimming

### Data
- **266 countries** — pre-processed composite risk scores in `data/risk_scores.json`
- Historical data: 2000–2024 from ERA5, EM-DAT, GDELT, FAO, World Bank, WHO

---

## 📁 Project Structure

```
resilience-ai-ui-spec/
├── app/                        # Next.js pages
│   ├── page.tsx                # Landing page
│   ├── chat/                   # AI Chat interface
│   ├── agents/                 # Agent Network visualizer
│   ├── cascade/                # Cascade Simulator
│   ├── country/[id]/           # Country deep dive
│   └── api/                    # API route handlers
│       ├── chat/               # Proxy to Python agent server
│       ├── stats/              # Dashboard data
│       ├── enrich/             # AI country enrichment
│       └── analyze-country/    # Country risk narrative
├── ai_agents/                  # Python multi-agent backend
│   ├── server.py               # FastAPI server (port 8000)
│   ├── main.py                 # Agent graph builder
│   ├── config.py               # RemoteBlackwellChatModel + shared config
│   ├── prompts.yaml            # All agent system prompts
│   ├── agents/                 # 8 specialized agent modules
│   └── output/                 # Pre-processed CSV datasets
├── components/                 # React components
│   ├── dashboard/              # Risk map, alert ticker, threat matrix
│   └── country/                # Radar chart, risk tabs
├── data/
│   └── risk_scores.json        # Pre-computed country risk scores
├── lib/
│   ├── data-loader.ts          # Server-side data access
│   └── types.ts                # Shared TypeScript types
└── scripts/
    └── risk_engine.py          # Data processing pipeline
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [Python 3.10+](https://www.python.org/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/aatmaj28/ResilienceAI---AINU-26-Hackathon.git
cd ResilienceAI---AINU-26-Hackathon
```

**2. Install frontend dependencies**
```bash
pnpm install
```

**3. Install Python dependencies**
```bash
pip install -r ai_agents/requirements.txt
```

**4. Run everything**
```bash
pnpm run dev:all
```
This concurrently starts:
- Next.js dev server on **http://localhost:3000**
- Python FastAPI agent server on **http://localhost:8000**

---

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | `POST` | Send a query to the multi-agent swarm |
| `/api/stats` | `GET` | Fetch global dashboard data (all countries) |
| `/api/enrich` | `POST` | Generate AI risk summaries for a set of countries |
| `/api/analyze-country` | `POST` | Generate a detailed AI narrative for one country |
| `/api/countries/[iso3]` | `GET` | Fetch detailed risk data for a specific country |

---
