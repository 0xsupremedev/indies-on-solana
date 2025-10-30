# Indies on Solana

<img width="1344" height="768" alt="indies solana game" src="https://github.com/user-attachments/assets/6c618985-5cd2-44bd-98a1-d001234e3d1c" />


A full-stack realtime Solana-integrated arena demo with:

- Anchor program (match creation, purchases, settlement, events)
- Node/Socket.IO game server with authoritative combat, AI bots, rewards
- Relayer that watches on‑chain events and drives in-game effects
- React + React Three Fiber client (HUD, nameplates, team bars, effects)
- Stream overlay (React) for wallet connect, buy actions, and live feed

> This repo is structured so you can run the game locally, trigger on‑chain viewer actions, and settle the match on‑chain after the round ends.

---

## Contents
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Running locally](#running-locally)
- [Configuration](#configuration)
- [Anchor program](#anchor-program)
- [Server (game + relayer)](#server-game--relayer)
- [Client (game HUD)](#client-game-hud)
- [Overlay](#overlay)
- [Socket events](#socket-events)
- [Settlement flow](#settlement-flow)
- [Anti‑abuse & rate limits](#anti-abuse--rate-limits)
- [Testing & simulations](#testing--simulations)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
client/           React + R3F game UI/HUD
  src/
    game/         Arena, Player, Effects, Scene
    ui/           HUD, Menus, Viewer Dashboard
    hooks/        useSocketEvents (socket wiring)
    stores/       Zustand stores

server/           Node + Socket.IO authoritative game server
  src/
    index.ts      Express + Socket.IO entry, CORS
    gameServer.ts Combat, AI bot, round end, rewards
    blockchainService.ts  Relayer: watch Anchor / map events to effects
    analyticsService.ts   Leaderboard/recents (demo)

shared/           Shared TS types for S2C/C2S events

overlay/          Stream overlay, minimal React widget + vanilla adapter

indies-anchor/    Anchor program (Rust)
  src/lib.rs      Instructions, accounts, events (create/make_purchase/settle)
```

Data flow:
- Viewer → Solana tx → Anchor event → Relayer (server) → GameServer → HUD/Overlay
- Players → Socket.IO to server (playerMove/playerShoot) → authoritative hit/death/roundEnd → HUD

---

## Prerequisites
- Node 18+
- pnpm or npm (repo uses npm scripts)
- Rust + Anchor + Solana CLI (for on‑chain build/deploy)
  - Rust: https://www.rust-lang.org/tools/install
  - Anchor: https://book.anchor-lang.com/
  - Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
- GitHub CLI (optional, for CI/metadata): https://cli.github.com

---

## Install
From repo root:
```bash
# Server deps
cd server && npm install

# Client deps
cd ../client && npm install

# Overlay deps (minimal)
cd ../overlay && npm install || true
```

---

## Running locally
Terminal A – server:
```bash
cd server
# free port 8787 is typical; this repo uses 8888 for convenience
$env:PORT="8888"  # PowerShell
npm run start
```

Terminal B – client (Vite):
```bash
cd client
npm run dev
# open the URL (3000/3001/3002 depending on availability)
```

Notes
- The client is configured to connect to `http://localhost:8888` by default (see `client/src/App.tsx`).
- On first load, a demo round auto‑starts and a red AI bot spawns so you can test solo.

---

## Configuration
Create `.env` where needed (server/ and optionally root):

Server `.env` (examples)
```
PORT=8888
CLIENT_URL=http://localhost:3001
SOLANA_RPC_URL=https://api.devnet.solana.com
ANCHOR_PROGRAM_ID=EnterYourAnchorProgramIDHere
GAME_WALLET_ADDRESS=11111111111111111111111111111112
BASE_REWARD_SOL=0.01
BONUS_PER_LEVEL_SOL=0.002
```

Client (Vite) – `.env` at `client/.env` (optional):
```
VITE_SERVER_URL=http://localhost:8888
```

---

## Anchor program
Location: `indies-anchor/src/lib.rs`

Instructions
- `create_match(ctx)` – initializes a match account, emits `MatchCreated`
- `make_purchase(ctx, effect_type, amount)` – records purchases/effects, emits `PurchaseMade`
- `settle_match(ctx, winner)` – seals the match and (intended) reward payout, emits `MatchSettled`

Accounts
- `Match` – creator, status, pot, winner, purchases, created_at
- `Purchase` – buyer, match_id, effect_type, amount, timestamp

Events (Anchor `emit!`)
- `MatchCreated { match_addr, creator, timestamp }`
- `PurchaseMade { buyer, match_addr, effect_type, amount, timestamp }`
- `MatchSettled { match_addr, winner, pot, timestamp }`

Build & test (optional):
```bash
cd indies-anchor
anchor build
anchor test --skip-local-validator
```

---

## Server (game + relayer)
Key files
- `src/index.ts` – Express + Socket.IO, wide CORS for localhost dev
- `src/gameServer.ts` – authoritative combat, AI bot, reward scaling
  - Hitscan damage, `playerHit`, `playerDied`, `roundEnd(winner, rewardLamports)`
  - AI bot spawns when only one human connects; chases and shoots nearest target
  - Reward lamports = `BASE_REWARD_SOL + (roundNumber-1) * BONUS_PER_LEVEL_SOL`
- `src/blockchainService.ts` – watches Solana tx logs; parses Anchor events; maps to ViewerEffect and forwards to game

Planned settlement hook
- On `roundEnd`, call Anchor `settle_match` with winner/wallet and stats.
- Use RPC + wallet signer (not committed here) and emit HUD "settled" confirmation.

---

## Client (game HUD)
Key files
- `src/game/scenes/GameScene.tsx` – lighting, environment, arena, players/effects
- `src/game/entities/Player.tsx` – blocky player avatar, nameplate, head HP bar
- `src/ui/GameHUD.tsx` – team health bars (Blue left / Red right), minimap, killfeed, scoreboard, event popups
- `src/hooks/useSocketEvents.ts` – all Socket.IO events (game state, hits, deaths, round end, anchor events)
- `src/stores/` – Zustand stores for game/socket state

User flow
- Auto‑join ‘demo-room’ after the loading screen.
- Move with WASD/Arrow keys, left‑click to shoot.
- Round ends when one team is eliminated; reward popup shows SOL amount.

---

## Overlay
- `overlay/` contains a small overlay manager and a React widget (`ReactOverlay.jsx`).
- It connects to server via Socket.IO to display leaderboard and recent actions.
- For production, bundle the overlay and embed it as a browser source in OBS.

---

## Socket events
Shared in `shared/types.ts`.

Server → Client (`ServerToClientEvents`)
- `gameState(state)` – periodic authoritative state
- `playerJoined(player)` / `playerLeft(playerId)`
- `playerMove(player)` – mirror movement for others in room (low frequency)
- `playerHit(playerId, damage, attackerId)`
- `playerDied(playerId, killerId)`
- `roundEnd(winner, rewardLamports?)`
- `effectTriggered(effect)` / `projectileCreated(projectile)`
- Anchor relayer passthroughs: `anchorMatchCreated`, `anchorPurchase`, `anchorMatchSettled`

Client → Server (`ClientToServerEvents`)
- `joinRoom(roomId, playerName)` / `leaveRoom()`
- `playerMove(position, rotation)`
- `playerShoot(direction, projectileType)`
- `requestGameState()`

---

## Settlement flow
1. Server tracks combat; on win, computes `rewardLamports`.
2. Server emits `roundEnd(winner, rewardLamports)` to HUD immediately.
3. Settlement service (planned) sends Anchor `settle_match` for the match and winner.
4. On success, Anchor emits `MatchSettled` → Relayer → HUD confirmation.

Recommended env for rewards:
```
BASE_REWARD_SOL=0.01
BONUS_PER_LEVEL_SOL=0.002
```

---

## Anti‑abuse & rate limits
- Client rate limits shooting; server validates and caps fire rate.
- Server is authoritative for HP and deaths; client never sets HP.
- Receipt replay protection: relayer ignores duplicated signatures.
- Add reverse proxy or WAF in production for IP-based throttling.

---

## Testing & simulations
- Local simulation (no chain): run server + client → fight AI bot.
- Chain event sim: send small SOL to the configured wallet with memo → relayer maps to effects.
- Integration tests (suggested):
  - Socket events contract tests
  - Settlement dry-run invocation against localnet

---

## Troubleshooting
- Black screen / socket.on is not a function
  - Ensure server is running and client connects to correct URL (`VITE_SERVER_URL` or default `http://localhost:8888`).
  - CORS must allow client port (see `server/src/index.ts`).
- Web audio blocked
  - Click anywhere to enable audio (browser policy).
- Anchor errors
  - Confirm `ANCHOR_PROGRAM_ID`, wallet, and `SOLANA_RPC_URL` are set; `anchor build` runs locally.

---

## License
MIT
