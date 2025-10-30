# Coin Wars 3D - Demo Guide

## 🎮 What's Been Built

A complete 3D multiplayer arena shooter with real-time viewer interaction via Solana blockchain, built for the Indies On Solana hackathon.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Start development servers
npm run dev
```

## 🎯 How to Test

### 1. Start the Game
- Open http://localhost:3000 in your browser
- The game will automatically connect and join a demo room
- You'll see a 3D arena with your player character

### 2. Test Player Controls
- **WASD**: Move around the arena
- **Mouse**: Look around (camera follows)
- **Click**: Shoot projectiles
- **Viewer Dashboard**: Click the button in bottom-right to open viewer controls

### 3. Test Viewer Interaction
- Click "Viewer Dashboard" button
- Connect a Solana wallet (Phantom/Solflare)
- Try purchasing effects with SOL (on devnet)
- Watch effects appear in the 3D game world

### 4. Test Stream Overlay
- Open http://localhost:3001/overlay in OBS Browser Source
- The overlay shows live leaderboards and viewer actions
- Perfect for streaming the game

## 🎨 Features Implemented

### ✅ Core Game Features
- **3D Arena**: Beautiful 3D environment with team zones
- **Player Movement**: Smooth WASD controls with mouse look
- **Shooting System**: Projectile-based combat with different weapon types
- **Team System**: Blue vs Red team battles
- **Health System**: Player health with visual indicators
- **Physics**: Realistic 3D physics and collisions

### ✅ Viewer Interaction System
- **Wallet Integration**: Connect Phantom, Solflare, and other Solana wallets
- **Effect Purchasing**: 10 different effects with varying SOL costs
- **Real-time Triggers**: Effects appear instantly in the game
- **Transaction Verification**: All actions recorded on Solana blockchain

### ✅ Multiplayer System
- **Room-based Matchmaking**: Join rooms with up to 8 players
- **Real-time Sync**: Smooth player position and state synchronization
- **Socket.io Backend**: Robust multiplayer server architecture
- **Auto-join Demo**: Automatically joins a demo room for testing

### ✅ Blockchain Integration
- **Solana Devnet**: Test with devnet SOL (free)
- **Transaction Monitoring**: Real-time blockchain event detection
- **Effect Pricing**: Configurable SOL costs per effect type
- **Wallet Support**: Multiple wallet adapter support

### ✅ Stream Overlay
- **Live Leaderboards**: Top spenders and contributors
- **Action Feed**: Real-time viewer action notifications
- **Game Stats**: Round info, player count, effect count
- **OBS Ready**: Perfect for streaming integration

## 🎮 Viewer Effects Available

| Effect | Cost | Description | Visual |
|--------|------|-------------|---------|
| Health Pack | 0.01 SOL | Drop a health pickup | ❤️ Green sphere |
| Ammo Box | 0.01 SOL | Drop an ammo pickup | 🔫 Yellow cube |
| Shield | 0.015 SOL | Drop a shield pickup | 🛡️ Blue sphere |
| Laser Beam | 0.02 SOL | Fire a laser beam | ⚡ Red beam |
| Mine | 0.025 SOL | Place an explosive mine | 💣 Orange sphere |
| Minion | 0.03 SOL | Spawn an enemy minion | 👹 Red robot |
| Slow Motion | 0.04 SOL | Slow down time briefly | ⏰ Time effect |
| Gravity Flip | 0.05 SOL | Reverse gravity for all players | 🔄 Gravity effect |
| Turret | 0.06 SOL | Deploy a defense turret | 🏰 Gray structure |
| Coin Rain | 0.08 SOL | Make it rain coins! | 💰 Yellow rain |

## 🔧 Technical Architecture

### Frontend (Client)
- **Three.js + React Three Fiber**: 3D graphics and rendering
- **React + TypeScript**: Modern UI with type safety
- **Socket.io Client**: Real-time multiplayer communication
- **Solana Wallet Adapter**: Blockchain wallet integration
- **Zustand**: State management

### Backend (Server)
- **Node.js + Express**: REST API and static file serving
- **Socket.io**: Real-time multiplayer server
- **Solana Web3.js**: Blockchain transaction monitoring
- **TypeScript**: Type-safe server code

### Blockchain Integration
- **Solana Devnet**: Fast, low-cost transactions
- **Transaction Monitoring**: Real-time effect detection
- **Wallet Integration**: Phantom, Solflare support
- **Effect Pricing**: Configurable SOL costs

## 🎯 Hackathon Requirements Met

✅ **Playable Game**: Full 3D multiplayer arena shooter  
✅ **Solana Integration**: Real blockchain transactions  
✅ **Viewer Interaction**: Live stream audience participation  
✅ **Stream Overlay**: OBS-ready overlay with analytics  
✅ **Documentation**: Complete setup and usage guide  
✅ **Innovation**: Novel 3D blockchain gaming concept  
✅ **Technical Execution**: Robust, scalable architecture  

## 🚀 Next Steps for Production

1. **Deploy to Production**:
   - Deploy client to Vercel/Netlify
   - Deploy server to Railway/Fly.io
   - Set up production Solana mainnet integration

2. **Enhanced Features**:
   - Add sound effects and music
   - Implement more weapon types
   - Add power-up collection mechanics
   - Create multiple arena maps

3. **Streamer Tools**:
   - Custom overlay themes
   - Streamer dashboard
   - Analytics and metrics
   - Monetization tools

## 🎉 Demo Success!

The game is fully functional and ready for the hackathon submission. Players can:
- Join multiplayer games instantly
- Use viewer dashboard to influence gameplay
- See real-time effects in the 3D world
- Stream with professional overlay

**Ready to showcase the future of blockchain gaming!** 🚀
