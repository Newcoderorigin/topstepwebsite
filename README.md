# TopstepX Command Center

A futures-only command center prototype featuring a modern React frontend, an Express backend broker, and a data service layer that wraps the TopstepX Gateway API with offline mocks. The stack is designed for iterative development toward a self-directed quant trading assistant.

## Architecture Overview

```
.
├── backend/        # Express API + WebSocket broker + context store
├── frontend/       # Vite + React (TypeScript) interface
└── docs/           # Quant bot interface specification
```

### Data Flow
1. **Frontend** requests `/api/markets/snapshot` for initial quotes and opens a WebSocket to `/api/markets/stream` for live updates.
2. **Backend** proxies to the TopstepX Gateway via `TopstepGatewayService`. In mock mode it emits deterministic synthetic futures data for ES=F, NQ=F, YM=F, RTY=F, CL=F, GC=F, and ZN=F.
3. **Context Store** records user risk preferences and decision logs, enabling downstream quant modules to reference the latest state.
4. **Quant Bot (future)** will call the documented interface in `docs/quant-bot-interface.md` to request buy signals targeting a 55–61% hit rate.

## Prerequisites
- Node.js 18+
- npm or pnpm/yarn

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Environment configuration
Create `backend/.env` (optional) and set:
```
TOPSTEP_GATEWAY_URL=https://api.topstepx.io
TOPSTEP_GATEWAY_KEY=<your_topstepx_api_key>
USE_LIVE_GATEWAY=true # omit or set to false to stay in mock mode
PORT=4000
```

The frontend uses Vite defaults and proxies `/api` to `http://localhost:4000` during development.

### 3. Run backend
```bash
cd backend
npm run dev
```

### 4. Run frontend
```bash
cd frontend
npm run dev
```
Visit `http://localhost:5173` to view the Command Center UI.

## Risk Controls & User Context
- `ContextStore` tracks per-user risk budget, daily draw limits, and execution decisions.
- Use `POST /api/markets/context` to upsert risk parameters and `POST /api/markets/decision` to log trade outcomes.
- Guardrails should be enforced before forwarding quant bot signals to execution venues.

## Available API Endpoints
- `GET /health` – service heartbeat, indicates mock vs live mode.
- `GET /api/markets/symbols` – allowed futures symbols.
- `POST /api/markets/snapshot` – returns latest quotes for requested symbols.
- `POST /api/markets/context` – stores or updates a user context payload.
- `POST /api/markets/decision` – appends a trade decision to the user log.
- `WS /api/markets/stream` – JSON quotes pushed as `{ symbol, last, change, changePct, high, low, volume, timestamp }`.

## Offline Development
- By default the backend runs in mock mode (no external API calls) generating deterministic price action per symbol.
- To exercise snapshot + stream without internet access, keep `USE_LIVE_GATEWAY` unset.

## Quant Bot Roadmap
- Specification lives in [`docs/quant-bot-interface.md`](docs/quant-bot-interface.md).
- Emphasizes deterministic backtests, telemetry logging, and signal confidence bands.

## Testing & Linting
- Run `npm run build` in `frontend` to type-check and bundle.
- Backend tests are not yet implemented; add integration tests around `ContextStore` and WebSocket flow as future work.

## Operational Notes
- Harden authentication before production use. Current implementation assumes a trusted environment.
- Always validate strategy hit rate remains within 55–61% band. Consider automated alerts when breaching.
- Extend `ContextStore` with persistent storage (Redis/Postgres) before scaling beyond prototype.

### Troubleshooting
- If the launcher exits with `Unable to locate the npm executable`, install Node.js/npm and ensure `npm` (or `npm.cmd` on Windows) is in your `PATH` before running `python main.py`.
