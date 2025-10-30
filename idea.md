About Indies On Solana Indies On Solana is all about pushing the boundaries of gaming on the Solana blockchain and is focused on building a tight-knit community of game devs, creatives to innovate in the web3 space. For the Cypherpunk hackathon, we're particularly excited about our Underdog Hackathon track, where we challenge builders to reimagine what gaming can be. Mission Build interactive games that integrate Airdrop Arcade by vorld or on-chain, allowing viewers to directly influence gameplay. Requirements Integrate Airdrop Arcade: Your game should utilise Airdrop Arcade APIs or functionality to be built directly on Solana to enable real-time viewer interaction. The Loop: Focus on the core loop where: Developers build games. Players stream and play. Viewers spend coins to influence in-game actions (e.g., dropping boosts, spawning enemies, changing maps, or deciding outcomes). Unforgettable Runs: The goal is to make every gameplay session unique and memorable through viewer participation. Build Real Games: Focus on playable builds rather than just concepts or presentations. Submission Requirements A playable game built with above mentioned requirements. A clear explanation of how viewers can interact with the game. Documentation of your game's design and features. A video demonstration of your game in action, ideally showcasing viewer interaction during a stream. Judging Criteria Innovation: How new and creative is the concept for interactive gameplay? Integration: How seamlessly the APIs/Solana are integrated to achieve goals. Gameplay Fun: Is the game engaging and enjoyable for both players and viewers?
Coin Wars – 2D Live Arena: A fast-paced 2D arena shooter with 4–8 players (1v1, 2v2, or free-for-all) where live viewers actively influence the game. Viewers spend micro-payments (on-chain via Airdrop Arcade or Solana) to drop power-ups, summon hazards (minions, lasers, etc.), or even alter the arena physics in real-time. Every transaction is visible on-chain as a proof of action. Key features include:

Core loop: 2D action built in Unity (C#) or Phaser (TypeScript) for fast visuals and networking.

Viewer actions: Drop items, spawn minions, flip the map, or trigger special effects via instant Airdrop Arcade transactions.

Live overlay: Stream overlay (e.g. with OBS BrowserSource) showing recent viewer actions, top spenders (wallet nicknames), and transaction hashes for auditability.

Integration: Airdrop Arcade SDK to handle real-time viewer inputs and Solana Wallet Adapter (Phantom/Solflare) for wallet auth.

Why it wins: High spectacle for streams (instant visible effects), clear monetization (audiences pay to influence), and an easy-to-demo gameplay loop. Spectators see immediate impact of their actions, boosting engagement – similar to Crowd Control’s success on Twitch
crowdcontrol.live
. Polished 2D visuals and tight combat ensure player skill matters, preventing pure chaos and keeping gameplay satisfying (players dodge viewer-triggered lasers, but skilled play still wins).
Coin Wars – 2D Live Arena: Comprehensive Development Plan

Game Concept: Coin Wars is a fast-paced 2D arena shooter (1v1, 2v2, or free-for-all) where live stream viewers actively influence the match. Players control characters in a brightly-rendered 2D arena (built in Unity or Phaser) and battle with guns, dodges, and power-ups. Meanwhile, viewers on Twitch/YouTube connect their crypto wallets and spend tiny Solana-based micro-payments to trigger game-altering effects – spawning minions, dropping power-ups, inverting gravity, firing lasers, etc. Each viewer action is an on-chain Solana transaction, providing a transparent, provable “proof of action” (transaction hash) that appears in the stream overlay. This creates a highly engaging spectacle: every quarter-second, the screen erupts with new events driven by the audience. Interactive streaming platforms (like Crowd Control) have shown that viewer-driven effects can dramatically boost engagement and revenue for streamers – for example, Crowd Control reports over 8.7 million viewer-triggered effects and an average 1.8× income boost
crowdcontrol.live
. By using Solana and the Airdrop Arcade framework, Coin Wars turns audience influence into a gamified, profitable experience for both players and streamers.

Core Gameplay Loop

Arena Combat: Up to 8 players (1v1, 2v2, or FFA) battle in a 2D top-down or side-view arena. Characters can move, aim, and fire in all directions. The core mechanics use tight physics (e.g. Unity’s 2D physics or Phaser’s Arcade physics) for crisp dodge-and-shoot gameplay. Skilled play is key: bullets fly fast, cover pops up, and players must dodge both bullets and incoming viewer-triggered hazards.

Player Skill vs Chaos: While viewers introduce chaos (e.g. random lasers or extra enemies), the game is balanced so that skill still matters. For example, hazards have predictable patterns or slight spawn delays, and power-ups are useful but not game-breaking. The netcode should use interpolation and client-side prediction (common in action games) to keep movement smooth and prevent network lag from spoiling the fight.

Game Modes: Standard deathmatch variants (last man standing, team battle) on small dynamic maps (0-gravity, flipping layouts, hazards). Rounds are short (e.g. 2–3 minutes) to keep the pace brisk. At the end of a round, stats are tallied and roles can swap players/teams.

Viewer Interaction Features

On-Chain Micro-Transactions: Viewers use Solana transactions to trigger effects. For example, a viewer connects their Phantom or Solflare wallet (via Solana Wallet Adapter) on a web UI, then clicks buttons like “Spawn Drone – 0.01 SOL” or “Laser Beam – 0.02 SOL.” Each click sends a signed Solana transaction (SPL token or SOL transfer, possibly to a game wallet or smart contract). These transactions are instant and low-fee on Solana.

Triggered Effects: The game supports a catalog of viewer actions. Examples include:

Power-Up Drops: Instantly drop a random power-up (ammo, health, shield) at the viewer’s chosen location or a random spot.

Hazard Spawns: Summon computer-controlled “minions” or drones that chase/attack players, or fire laser beams or mines in the arena.

Map/Pysics Changes: Flip the map upside-down, reverse gravity, slow down time, or distort movement for all players for a few seconds.

Special Effects: Screen-wide EMP blasts, rain of coins that players can collect, sudden darkness, etc.

Immediate Feedback: As soon as a transaction is confirmed, the effect appears in-game. For example, 0.5 seconds after a viewer pays, a laser beam flashes on screen at the selected spot. This instant gratification is crucial: viewers see the immediate impact of their micro-payment. Streaming overlays will highlight the action (e.g. “Alice (Wallet 🌟) spent 0.01 SOL to spawn Laser #1234…”). This live feedback loop (viewer action → game event → on-screen effect) drives engagement; platforms like Crowd Control have proven that giving audiences real-time control yields more laughter, suspense, and donations
crowdcontrol.live
.

Proof & Auditability: Since every viewer action is a Solana transaction, all events are provably recorded on-chain. The stream overlay can display transaction hashes or links to a block explorer for transparency. This “on-chain proof of action” builds trust: viewers know their spend actually affected the game, and streamers have a tamper-proof log of contributions.

Tech Stack Overview
Game Engine & Frontend

Unity (C#): Ideal for high-performance 2D graphics and physics. Unity’s 2D tools and rich asset pipeline allow for polished visuals, particle effects (explosions, lasers), and audio. C# scripting is robust for game logic. Unity supports building a standalone PC game, which can be captured by OBS.

Phaser (TypeScript): A lightweight HTML5 2D engine, easy for web deployment. Phaser could allow the game to run in-browser (simpler streaming but potentially lower performance). Networking via web sockets is straightforward in JS. Phaser’s Canvas/WebGL can handle fast action, though very large player counts or heavy effects might challenge it.

Choice: Both engines can achieve the core loop. Unity offers more horsepower and offline multiplayer libraries, while Phaser simplifies web integration. A unified decision might favor Unity for a “traditional” PC/console-style build, using Photon or Mirror for networking, with a small Node.js service bridging to the web components. Phaser would bundle game and viewer UI together in a browser, but 8-player real-time action might be better on a desktop. Either way, the game must maintain ~60 FPS and a high tick rate for network sync.

Multiplayer Networking

Server Model: An authoritative server model is recommended to prevent cheating and ensure consistency. The server (could be hosted on a cloud VM or use a managed service) runs the game simulation. Clients (players) send input (movement, fire) to server; server broadcasts state updates.

Unity Options:

Photon Realtime/PUN: Easy cloud solution with lobby/room management. Good for quick setup but CCU (concurrent users) costs can scale.

Mirror or Unity Netcode: Open-source alternatives. Mirror can run on a simple dedicated server (no cost aside from host) and is proven for indie games. Requires more manual setup of host instances.

Multiplay: Unity’s hosted solution (note: sometimes limited usage).

Web (Phaser) Options:

Colyseus: A multiplayer framework for Node.js, pairs well with Phaser.

Socket.io / WebSockets: Custom solution using Node.js + Express for state sync. Can implement basic room matchmaking.

Data Flow: The server tracks player positions, bullet projectiles, and viewer-effect events. It receives “trigger” commands from the backend (see below) to spawn items or hazards. All clients and the server smoothly reconcile via interpolation for positions and inputs.

Blockchain Integration

Solana Platform: Chosen for its very low-latency and low-fee transactions, ideal for streaming use. Solana can handle thousands of transactions per second with fees typically < $0.001, making micropayments feasible. A Solana-based web3 stack ensures all viewer actions are immutable and transparent.

Airdrop Arcade: Bybit’s Airdrop Arcade is a new “quest-to-earn” platform that gamifies on-chain interactions
prnewswire.com
. In practice, we will use Airdrop Arcade’s SDK/API (if available) or directly interact with Solana. The idea is to let viewers use the Arcade portal or a custom UI to send transactions. Arcade consolidates the wallet connectivity and token rewards for players, which could be repurposed: for example, viewers might even earn small NFT/coin rewards from the game’s on-chain contract (extra incentive). If the Airdrop Arcade SDK is provided, we integrate it to handle transaction creation and processing; if not, we implement the same functionality via Solana web3.js and Anchor. Either way, the game subscribes to on-chain events via an API layer.

Smart Contracts: We can create a Solana program (smart contract) that defines payable actions. For example, each effect has an associated program instruction: a viewer calls “DropLaser” by sending an instruction with the transaction. The contract could burn a small token or simply accept SOL/USDC. We can use the Anchor framework to develop and deploy this on Solana devnet/mainnet. This contract emits an event log on each invocation.

Realtime Event Streaming: Instead of polling, we use a service like Helius or QuickNode to get live transaction/webhook feeds. Helius provides WebSocket/webhook subscriptions to on-chain events. For example, we can subscribe to the game’s program address; whenever a transaction occurs (viewer action), Helius pushes the parsed event to our server
helius.dev
. This ensures <1s detection. Helius explicitly supports gaming use-cases (“Stream onchain alerts for in-game … rewards and loot”
helius.dev
). So the flow is: viewer transaction → Solana network → Helius webhook → our backend.

Transaction Handling: The backend verifies each incoming transaction (correct instruction, sufficient amount). It extracts the user’s wallet address and which effect was purchased. The backend then sends a message (e.g. via WebSocket) to the game server to trigger the corresponding action. Simultaneously, the backend updates the overlay data (recent actions, leaderboards). This decouples the on-chain world from the game world but connects them via real-time streams.

Wallet Integration & Viewer UI

Wallet Connection: We build a web UI (React/TypeScript) where viewers connect their Solana wallets. We use Solana Wallet Adapter (a standard library) to support Phantom, Solflare, and others
solana.com
. This provides a “Connect Wallet” button and easy access to sign transactions.

Action Dashboard: Once connected, the UI shows the list of available effects and their prices. Each action has a button and maybe a mini-map for targeting (if relevant). When the viewer clicks, we call sendTransaction via wallet adapter, which opens Phantom to approve and submit. Because of Solana’s low fees, this process is quick.

Usernames & Reputation: After connecting, we map the wallet address to a display name (e.g. wallet alias or a nickname the user enters). This name (not the raw address) is used in the overlay for readability. We also track how much each address has spent during the stream, so we can compute top spenders. This can be kept in-memory or a lightweight DB (since data volume is small).

On-Chain Tokens: Optionally, we could allow payments in a specific SPL token (like BONK or USDC) if desired for branding or to tap into community tokens. In that case, the wallet adapter also handles token transfers. The contract logic would check token transfers instead of SOL.

Stream Overlay & HUD

OBS Browser Source: We create a live overlay as an HTML/JS page and add it to OBS via a Browser Source. This overlay has multiple components:

Recent Events Panel: A scrolling list of the latest 10 viewer actions, e.g. “🎯 [0:12] Alice spent 0.01 SOL → Spawn Laser (TX: ABC123…)”. Each entry links to a block explorer or shows a hash for audit. We cite [2] to note that Airdrop Arcade offers “interactive reward-earning quests” which is analogous to what viewers do
prnewswire.com
.

Top Spenders Leaderboard: A small table showing the top 3 or 5 spenders (wallet aliases) and their totals, updated in real-time. Viewers see their rank rise as they invest more.

Timers/Meters: If needed, display a “cooldown” meter if an effect is temporarily unavailable, or a counter of how many effects have been purchased so far this round.

Real-Time Data Feed: The backend sends data to the overlay via WebSockets (e.g. using Socket.IO). On each confirmed transaction, the backend emits an event to the overlay, which animates the new entry (e.g. fades in). This makes the overlay react instantly along with the game. Using a browser-based overlay is common in streaming (OBS supports it natively), and it seamlessly shows HTML content over the game video.

Attribution & Audit: Because viewers pay real money (cryptocurrency) to trigger these events, the overlay will prominently show transaction hashes and wallet nicknames. This transparency encourages trust and “proof of action.” We may cite Helius or blockchain sources if needed to emphasize this transparency, but it is a known benefit of on-chain systems.

Backend & Infrastructure

Node.js/Express Server: We run a lightweight backend server (e.g. Node.js) that ties everything together. Its responsibilities include: subscribing to Solana events (via Helius or RPC), validating and parsing viewer transactions, maintaining a list of viewer spend totals/nicknames, and broadcasting messages to the game server and overlay.

WebSockets: Use Socket.IO (or native WebSockets) to push events to the game and overlay. The game client and overlay page both open a WebSocket connection to this server.

Database: For a small-scale game, an in-memory store (or lightweight DB like Redis or SQLite) can track the current stream’s data (nicknames, spenders). Persistence beyond a session isn’t crucial unless we want historical analytics.

Authentication: Secure endpoints so only valid game instances can send/receive data. For example, the game server could authenticate to the backend (with a token) so only it receives effect commands.

Hosting: We can deploy the backend on a cloud VM or container service. Since load is low (a few hundred viewers, dozens of tx/sec max), a small instance (AWS EC2, Heroku, or similar) suffices. Helius itself is a cloud service, so we don’t need to run our own Solana nodes.

Security & Failover: Use HTTPS and secure WebSockets. Optionally, host two instances for redundancy. Since the game state is ephemeral, if the backend restarts it can recover by re-listening to on-chain events from the last block.

Deployment & DevOps

Version Control & CI/CD: Use GitHub (or similar) for code. Automate builds for the game (Unity Cloud Build or GitHub Actions to compile each commit).

Game Builds: Regular builds of the Unity game for testing; phaser code pushed to a staging site for QA.

Staging vs Production: Deploy a test environment (on Solana devnet) to iterate, then launch on mainnet with real SOL.

Monitoring: Log transactions and game events for analytics. Monitor latency of event propagation (goal: viewer tx → effect in <1s).

Tools: Unity Editor (for game), Visual Studio/VS Code, Node/NPM, React for UI, Helius CLI or dashboard, Solana Explorer for debugging, OBS for streaming.

System Architecture & Data Flow

Viewer Action: A viewer connects wallet in the browser and clicks an action button.

On-Chain Transaction: The browser uses Solana Wallet Adapter (e.g. Phantom) to send a transaction to our on-chain program (or simply transfer SOL to a designated game address). This is a real Solana TX.

Blockchain Processing: Solana confirms the transaction in ~1 second.

Event Streaming: Our server (via Helius/QuickNode) receives the transaction data (program ID, sender, amount, instruction data). It verifies it matches a valid effect purchase.

Backend Dispatch: The server broadcasts a message to the game server (via a WebSocket “effect” channel), containing: effect type, parameters (location, etc.), and viewer ID. Simultaneously it updates the overlay state (adds to recent list, updates leaderboards) and emits to the overlay page.

Game Server Reaction: The game server (Unity/Phaser) receives the effect command. It spawns the requested power-up/hazard in-game at the target location. This is visible to all players in the arena.

Overlay Update: The stream overlay (HTML) displays the new event (with wallet nickname and tx hash) and refreshes top spender table.

Round End: At round end, optionally, the top viewer(s) might get a shoutout or a small airdrop reward. The game resets for the next round.

This cycle repeats continuously during the live match, with hundreds of viewer transactions per hour driving the action. The architecture cleanly separates concerns: on-chain verification (Blockchain → Backend) and game logic (Backend → Game).

Implementation Roadmap

Prototype Core Game: Develop a simple 2D arena shooter (movement, shooting, basic physics) in Unity or Phaser. Create a test level and player characters.

Add Multiplayer: Integrate a networking solution (e.g. Mirror for Unity or Colyseus for Phaser). Test with 4–8 clients in a lobby. Ensure stable sync and reasonable latency.

Mock Viewer Effects: Temporarily simulate viewer actions with keyboard commands or a debug UI. E.g. press a key to drop a random power-up in-game. Use this to design the effect system and tune balance.

Wallet Connector & UI: Build the web frontend for viewers. Implement “Connect Wallet” via Solana Wallet Adapter and display dummy action buttons. Test signing and sending transactions on devnet (using devnet wallet and tokens).

Smart Contract (Solana): Write a simple Anchor program with one instruction per effect (or a generic “triggerEffect(effectID)” instruction). Deploy on devnet. Ensure it logs which effectID and who called it.

Event Streaming: Set up a Helius (or QuickNode) account to subscribe to the deployed program. Have a Node.js server listen for these events (either via WebSocket or webhook).

Backend Logic: In Node, parse incoming events, validate them, and forward to game and overlay. For now, use console logs or a dummy overlay.

Overlay UI: Develop the HTML overlay page. Connect it to the backend via WebSocket. Implement live updating lists and leaderboards. Test by sending fake events from the server.

End-to-End Integration: Run all pieces together on devnet: a player host streams the game, viewers (testers) use wallets to send effects, and watch the result in-game. Debug synchronization and latency.

Polish & Security: Polish the UI/UX (graphics, feedback animations). Rate-limit or queue rapid-fire transactions to prevent overload. Sanitize inputs. Conduct a security review of the on-chain contract.

Launch: Switch to mainnet-beta with real Solana. Do a demo stream. Ensure analytics on viewer engagement.

Throughout, maintain agile sprints with regular playtests. By building iteratively (game first, then blockchain, then overlay), we ensure stable integration.

Why This Will Win

Spectacle & Engagement: Instant crowd-driven chaos makes great entertainment. Viewers love knowing they mattered on stream. As Crowd Control’s success shows, interactive streams keep audiences watching longer and donating more
crowdcontrol.live
. Coin Wars amplifies that by making the influence not just a donation alert, but a direct game mechanic.

Monetization Clarity: Every effect has a clear cost. Audiences willingly pay small amounts for big thrills. The overlay’s real-time feedback (see who’s spending and what happened) provides transparency. This direct-pay model is simpler than ads or subscriptions and feels like playing a casino-style game where they can win bragging rights.

Blockchain “Trustifier”: Recording actions on-chain (with transaction hashes) is a unique value-add. Viewers trust the system because it’s auditable: their on-chain receipts match in-game events. This credibility is similar to how decentralized platforms promise “no middlemen.” For example, Bybit’s Airdrop Arcade campaigns highlight how crypto projects are embracing gamified tasks
prnewswire.com
. We ride that wave by showing viewers the Web3 tech in action live.

Balanced Gameplay: Despite chaos, the core shooter remains skill-based. Well-designed power-up/hazard effects ensure that paying to cause mayhem doesn’t automatically ruin the match – it just spices it up. Skilled players can still outmaneuver or outshoot oncoming threats. This keeps competitive integrity: viewers feel powerful but know their effect isn’t unfairly killing everyone.

Demonstration & Viral Potential: Coin Wars is easy to demo: a streamer can have two friends play while the audience goes wild. It’s a “just add viewers” concept, perfect for crypto-focused content or Twitch. The novelty of paying $0.01 to zap the streamer with a laser is inherently viral, encouraging social sharing.

Existing Success Models: The idea builds on proven formats. Crowd Control and Twitch’s Bits/Channel Points show people like interactive streams
crowdcontrol.live
. Web3 pioneers like Azarus have explored blockchain-streaming combos (using AzaCoins tokens)
blockchaingamer.biz
. Coin Wars pushes this further with real crypto microtransactions and an on-chain reward feel, aligning with trends in Web3 gaming.

Technical Feasibility: Modern tools make this doable. Solana’s speed and frameworks like Anchor allow near-instant reactions. Solana Wallet Adapter handles the tricky wallet UX
solana.com
. Websocket services like Helius guarantee we can hook blockchain to games in real time
helius.dev
. With Unity/Phaser handling visuals, the tech pieces are all off-the-shelf or easy to assemble.

In summary, Coin Wars combines fast 2D action, spectator interactivity, and blockchain transparency into one package. The tech stack (Unity/Phaser + Solana + Node.js + OBS overlay) is robust yet well-supported. Each viewer action becomes a shareable on-chain moment, and each stream becomes a live crypto-powered game show. This mix of spectacle, monetization, and proven engagement strategies makes Coin Wars a winning concept for streamers and audiences alike.

 

Sources: We draw on best practices from interactive streaming and blockchain gaming. For example, platforms like Crowd Control have demonstrated massive viewer engagement and revenue gains from similar mechanics
crowdcontrol.live
. Solana-based games (e.g. a recent game by BAP) leverage fast on-chain tech to sync gameplay and livestreams
bap-software.net
helius.dev
. Solana’s official docs recommend using the Wallet Adapter for web3 integration
solana.com
. Bybit’s introduction of Airdrop Arcade highlights the industry trend toward gamified on-chain tasks
prnewswire.com
. We combine these insights into the plan above.

Sources