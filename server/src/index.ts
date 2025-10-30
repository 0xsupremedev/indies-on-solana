import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { GameServer } from './gameServer.js'
import { BlockchainService } from './blockchainService.js'
import { AnalyticsService } from './analyticsService.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:5173"
  ],
  credentials: true
}))
app.use(express.json())

// Initialize services
const gameServer = new GameServer(io)
const blockchainService = new BlockchainService(gameServer)
const analyticsService = new AnalyticsService(io)

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/rooms', (req, res) => {
  const rooms = gameServer.getRooms()
  res.json(Array.from(rooms.values()))
})

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = analyticsService.getLeaderboard()
  res.json(leaderboard)
})

app.get('/api/recent-actions', (req, res) => {
  const recentActions = analyticsService.getRecentActions()
  res.json(recentActions)
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`)

  socket.on('joinRoom', (roomId: string, playerName: string) => {
    gameServer.handlePlayerJoin(socket, roomId, playerName)
  })

  socket.on('leaveRoom', () => {
    gameServer.handlePlayerLeave(socket)
  })

  socket.on('playerMove', (position, rotation) => {
    gameServer.handlePlayerMove(socket, position, rotation)
  })

  socket.on('playerShoot', (direction, projectileType) => {
    gameServer.handlePlayerShoot(socket, direction, projectileType)
  })

  socket.on('requestGameState', () => {
    gameServer.sendGameState(socket)
  })

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`)
    gameServer.handlePlayerLeave(socket)
  })
})

// Start blockchain monitoring
blockchainService.start()

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Coin Wars 3D Server running on port ${PORT}`)
  console.log(`🎮 Game server ready for connections`)
  console.log(`⛓️  Blockchain monitoring active`)
})
