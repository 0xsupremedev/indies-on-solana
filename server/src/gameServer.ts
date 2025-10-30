import { Server, Socket } from 'socket.io'
import { 
  GameState, 
  Player, 
  Projectile, 
  ViewerEffect, 
  Room, 
  Vector3,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  ViewerEffectType
} from '../../shared/types'

export class GameServer {
  private rooms: Map<string, Room> = new Map()
  private players: Map<string, Player> = new Map()
  private projectiles: Map<string, Projectile> = new Map()
  private effects: Map<string, ViewerEffect> = new Map()
  private gameState: GameState
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private aiTimers: Map<string, number> = new Map()

  constructor(io: Server) {
    this.io = io
    this.gameState = {
      players: this.players,
      projectiles: this.projectiles,
      effects: this.effects,
      gameTime: 0,
      roundNumber: 1,
      isActive: false,
      gravity: { x: 0, y: -9.81, z: 0 },
      timeScale: 1.0
    }

    // Start game loop
    this.startGameLoop()
  }

  private startGameLoop() {
    setInterval(() => {
      this.updateGame()
    }, 1000 / 60) // 60 FPS
  }

  private updateGame() {
    // Update projectiles
    for (const [id, projectile] of this.projectiles) {
      projectile.lifetime -= 1/60
      if (projectile.lifetime <= 0) {
        this.projectiles.delete(id)
      } else {
        // Update position
        projectile.position.x += projectile.direction.x * projectile.speed / 60
        projectile.position.y += projectile.direction.y * projectile.speed / 60
        projectile.position.z += projectile.direction.z * projectile.speed / 60
      }
    }

    // Update effects
    for (const [id, effect] of this.effects) {
      // Effects have a lifetime of 10 seconds
      if (Date.now() - effect.timestamp > 10000) {
        this.effects.delete(id)
      }
    }

    // Update game time
    this.gameState.gameTime += 1/60

    // Bots
    this.updateBots()

    // Broadcast game state to all connected players
    this.broadcastGameState()
  }

  handlePlayerJoin(socket: Socket, roomId: string, playerName: string) {
    // Create room if it doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        name: `Room ${roomId}`,
        players: new Map(),
        maxPlayers: 8,
        gameMode: 'ffa',
        isActive: true,
        createdAt: Date.now()
      })
    }

    const room = this.rooms.get(roomId)!
    
    // Create player
    const player: Player = {
      id: socket.id,
      name: playerName,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      team: room.players.size % 2 === 0 ? 'blue' : 'red',
      isAlive: true,
      lastUpdate: Date.now()
    }

    // Add player to room and game state
    room.players.set(socket.id, player)
    this.players.set(socket.id, player)
    
    // Join socket room
    socket.join(roomId)
    socket.data = { playerId: socket.id, roomId, playerName }

    // Notify other players
    socket.to(roomId).emit('playerJoined', player)

    // Send current game state to new player
    this.sendGameState(socket)

    // Spawn a bot for demo if needed
    this.spawnBotIfNeeded(roomId)

    console.log(`Player ${playerName} joined room ${roomId}`)
  }

  handlePlayerLeave(socket: Socket) {
    const playerId = socket.id
    const roomId = socket.data?.roomId

    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId)!
      room.players.delete(playerId)
      
      // Notify other players
      socket.to(roomId).emit('playerLeft', playerId)
    }

    // Remove from game state
    this.players.delete(playerId)

    console.log(`Player ${playerId} left`)
  }

  handlePlayerMove(socket: Socket, position: Vector3, rotation: Vector3) {
    const player = this.players.get(socket.id)
    if (!player) return

    // Update player position and rotation
    player.position = position
    player.rotation = rotation
    player.lastUpdate = Date.now()

    // Broadcast to other players in the same room
    const roomId = socket.data?.roomId
    if (roomId) {
      socket.to(roomId).emit('playerMove', player)
    }
  }

  private getTeamHealth(team: 'blue' | 'red'): number {
    let total = 0
    for (const p of this.players.values()) {
      if (p.team === team && p.isAlive) total += p.health
    }
    return total
  }

  private applyDamage(victimId: string, damage: number, attackerId: string) {
    const victim = this.players.get(victimId)
    if (!victim || !victim.isAlive) return
    victim.health = Math.max(0, victim.health - damage)
    if (victim.health === 0) {
      victim.isAlive = false
      const roomId = Array.from(this.rooms.keys())[0]
      if (roomId) this.io.to(roomId).emit('playerDied', victimId, attackerId)
    } else {
      const roomId = Array.from(this.rooms.keys())[0]
      if (roomId) this.io.to(roomId).emit('playerHit', victimId, damage, attackerId)
    }
    this.checkWinCondition()
  }

  private checkWinCondition() {
    const blueAlive = Array.from(this.players.values()).some(p => p.team === 'blue' && p.isAlive)
    const redAlive = Array.from(this.players.values()).some(p => p.team === 'red' && p.isAlive)

    if (!blueAlive || !redAlive) {
      const winner = blueAlive ? Array.from(this.players.values()).find(p => p.team === 'blue') || null : Array.from(this.players.values()).find(p => p.team === 'red') || null
      const base = this.getEnvLamports(process.env.BASE_REWARD_SOL, 0.01)
      const bonus = this.getEnvLamports(process.env.BONUS_PER_LEVEL_SOL, 0.002)
      const rewardLamports = base + Math.floor((this.gameState.roundNumber - 1) * bonus)
      this.io.emit('roundEnd', winner || null, rewardLamports)
      // Prepare next round
      this.gameState.roundNumber += 1
      for (const p of this.players.values()) {
        p.health = p.maxHealth
        p.isAlive = true
      }
    }
  }

  handlePlayerShoot(socket: Socket, direction: Vector3, projectileType: string) {
    const player = this.players.get(socket.id)
    if (!player || !player.isAlive) return

    // Create projectile (for visuals)
    const projectile: Projectile = {
      id: `${socket.id}-${Date.now()}`,
      position: { ...player.position },
      direction,
      speed: 20,
      damage: 25,
      ownerId: socket.id,
      type: projectileType as 'bullet' | 'laser' | 'rocket',
      lifetime: 0.2 // short lifetime, hitscan-like
    }

    this.projectiles.set(projectile.id, projectile)

    const roomId = socket.data?.roomId
    if (roomId) {
      this.io.to(roomId).emit('projectileCreated', projectile)
    }

    // Simple hitscan: choose closest opposing player along direction within range
    const maxRange = 15
    const origin = player.position
    let bestTarget: { id: string, t: number } | null = null

    for (const [id, other] of this.players) {
      if (id === socket.id || !other.isAlive || other.team === player.team) continue
      const toTarget = {
        x: other.position.x - origin.x,
        y: other.position.y - origin.y,
        z: other.position.z - origin.z
      }
      const t = (toTarget.x * direction.x + toTarget.y * direction.y + toTarget.z * direction.z)
      if (t <= 0 || t > maxRange) continue
      // distance from line
      const proj = { x: direction.x * t, y: direction.y * t, z: direction.z * t }
      const dx = toTarget.x - proj.x
      const dy = toTarget.y - proj.y
      const dz = toTarget.z - proj.z
      const distSq = dx*dx + dy*dy + dz*dz
      if (distSq < 1.0) { // within 1 unit of ray
        if (!bestTarget || t < bestTarget.t) bestTarget = { id, t }
      }
    }

    if (bestTarget) {
      this.applyDamage(bestTarget.id, projectile.damage, socket.id)
    }
  }

  triggerViewerEffect(effect: ViewerEffect) {
    this.effects.set(effect.id, effect)

    // Broadcast to all players
    this.io.emit('effectTriggered', effect)

    console.log(`Viewer effect triggered: ${effect.type} by ${effect.walletAddress}`)
  }

  private broadcastGameState() {
    this.io.emit('gameState', this.gameState)
  }

  public sendGameState(socket: Socket) {
    socket.emit('gameState', this.gameState)
  }

  getRooms(): Map<string, Room> {
    return this.rooms
  }

  getGameState(): GameState {
    return this.gameState
  }

  private getEnvLamports(value: string | undefined, defaultSol: number): number {
    const sol = value ? parseFloat(value) : defaultSol
    if (Number.isNaN(sol)) return defaultSol * 1e9
    return Math.floor(sol * 1e9)
  }

  private spawnBotIfNeeded(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) return
    const humanCount = Array.from(room.players.values()).filter(p => !p.id.startsWith('bot-')).length
    const botCount = Array.from(room.players.values()).filter(p => p.id.startsWith('bot-')).length
    if (humanCount >= 1 && botCount < 1) {
      const botId = `bot-${Date.now()}`
      const bot: Player = {
        id: botId,
        name: 'EnemyBot',
        position: { x: 5, y: 1, z: 0 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        health: 100,
        maxHealth: 100,
        team: 'red',
        isAlive: true,
        lastUpdate: Date.now()
      }
      room.players.set(botId, bot)
      this.players.set(botId, bot)
      this.aiTimers.set(botId, Date.now())
      this.io.to(roomId).emit('playerJoined', bot)
    }
  }

  private updateBots() {
    for (const [id, p] of this.players) {
      if (!id.startsWith('bot-') || !p.isAlive) continue
      // Find nearest enemy
      let nearest: Player | null = null
      let best = Infinity
      for (const other of this.players.values()) {
        if (other.team === p.team || !other.isAlive) continue
        const dx = other.position.x - p.position.x
        const dz = other.position.z - p.position.z
        const d2 = dx*dx + dz*dz
        if (d2 < best) { best = d2; nearest = other }
      }
      if (nearest) {
        // Move slightly toward enemy
        const dirX = Math.sign(nearest.position.x - p.position.x)
        const dirZ = Math.sign(nearest.position.z - p.position.z)
        p.position.x += dirX * 0.05
        p.position.z += dirZ * 0.05
        // Aim
        p.rotation.y = Math.atan2(nearest.position.x - p.position.x, nearest.position.z - p.position.z)
        // Shoot every 600ms
        const last = this.aiTimers.get(id) || 0
        if (Date.now() - last > 600) {
          this.aiTimers.set(id, Date.now())
          const dir = { x: Math.sin(p.rotation.y), y: 0, z: Math.cos(p.rotation.y) }
          // Reuse playerShoot logic by crafting a lightweight projectile
          const projectile: Projectile = {
            id: `${id}-${Date.now()}`,
            position: { ...p.position },
            direction: dir,
            speed: 20,
            damage: 15,
            ownerId: id,
            type: 'bullet',
            lifetime: 0.1
          }
          this.projectiles.set(projectile.id, projectile)
          this.applyDamage(nearest.id, projectile.damage, id)
        }
      }
    }
  }

  /**
   * Called by blockchain relayer when a match is created on-chain
   */
  public newAnchorMatch(event: { match_addr: string, creator: string, timestamp: number }) {
    // Create a new room reference
    if (!this.rooms.has(event.match_addr)) {
      this.rooms.set(event.match_addr, {
        id: event.match_addr,
        name: `Anchor Match ${event.match_addr.slice(0, 8)}`,
        players: new Map(),
        maxPlayers: 8,
        gameMode: 'ffa',
        isActive: true,
        createdAt: event.timestamp || Date.now(),
      });
      this.io.emit('anchorMatchCreated', { matchId: event.match_addr, creator: event.creator, timestamp: event.timestamp });
      console.log(`[GameServer] Anchor match created:`, event.match_addr);
    }
  }

  /**
   * Called by relayer upon purchase/action event on-chain
   */
  public handleAnchorPurchase(event: { buyer: string, match_addr: string, effect_type: number, amount: string, timestamp: number }) {
    // TODO: Implement mapping of effect_type number (on-chain) to ViewerEffectType (frontend)
    // TODO: Use the effect type map from shared/types if available (or bring in shared lib)
    const dummyEffect = {
      id: `anchor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'drop_health' as ViewerEffectType,
      position: { x: 0, y: 1, z: 0 },
      walletAddress: event.buyer,
      amount: parseFloat(event.amount) / 1e9, // lamports to SOL
      timestamp: event.timestamp,
      transactionHash: event.buyer + '-' + event.timestamp,
    };
    this.triggerViewerEffect(dummyEffect);
    this.io.emit('anchorPurchase', event);
    console.log(`[GameServer] Anchor purchase by:`, event.buyer, 'effect:', event.effect_type);
  }

  /**
   * Called by relayer when match is settled
   */
  public settleAnchorMatch(event: { match_addr: string, winner?: string, pot: string, timestamp: number }) {
    if (this.rooms.has(event.match_addr)) {
      this.rooms.get(event.match_addr)!.isActive = false;
    }
    this.io.emit('anchorMatchSettled', event);
    console.log(`[GameServer] Anchor match settled:`, event.match_addr, 'winner:', event.winner);
  }
}
