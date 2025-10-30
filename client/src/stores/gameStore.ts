import { create } from 'zustand'
import { GameState, Player, Projectile, ViewerEffect, Vector3 } from '../../../shared/types'

interface GameStore {
  gameState: GameState | null
  currentPlayer: Player | null
  isInGame: boolean
  roomId: string | null
  
  // Actions
  setGameState: (state: GameState) => void
  setCurrentPlayer: (player: Player) => void
  setInGame: (inGame: boolean) => void
  setRoomId: (roomId: string) => void
  updatePlayer: (playerId: string, updates: Partial<Player>) => void
  addProjectile: (projectile: Projectile) => void
  removeProjectile: (projectileId: string) => void
  addEffect: (effect: ViewerEffect) => void
  removeEffect: (effectId: string) => void
  reset: () => void
}

// Create default player
const createDefaultPlayer = (): Player => ({
  id: 'player-1',
  name: 'Player',
  position: { x: 0, y: 2, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  health: 100,
  maxHealth: 100,
  team: 'blue',
  isAlive: true,
  lastUpdate: Date.now()
})

// Create default game state with players
const createDefaultGameState = (): GameState => {
  const bluePlayer = createDefaultPlayer()
  const redPlayer: Player = {
    id: 'player-2',
    name: 'RedPlayer',
    position: { x: 5, y: 2, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
    health: 100,
    maxHealth: 100,
    team: 'red',
    isAlive: true,
    lastUpdate: Date.now()
  }
  
  const players = new Map()
  players.set(bluePlayer.id, bluePlayer)
  players.set(redPlayer.id, redPlayer)
  
  return {
    players,
    projectiles: new Map(),
    effects: new Map(),
    gameTime: 0,
    roundNumber: 1,
    isActive: true,
    gravity: { x: 0, y: -9.81, z: 0 },
    timeScale: 1.0
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createDefaultGameState(),
  currentPlayer: createDefaultPlayer(),
  isInGame: true,
  roomId: 'demo-room',

  setGameState: (state) => set({ gameState: state }),
  
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  
  setInGame: (inGame) => set({ isInGame: inGame }),
  
  setRoomId: (roomId) => set({ roomId }),
  
  updatePlayer: (playerId, updates) => {
    const { gameState } = get()
    if (!gameState) return
    
    const player = gameState.players.get(playerId)
    if (player) {
      const updatedPlayer = { ...player, ...updates, lastUpdate: Date.now() }
      gameState.players.set(playerId, updatedPlayer)
      set({ gameState: { ...gameState } })
    }
  },
  
  addProjectile: (projectile) => {
    const { gameState } = get()
    if (!gameState) return
    
    gameState.projectiles.set(projectile.id, projectile)
    set({ gameState: { ...gameState } })
  },
  
  removeProjectile: (projectileId) => {
    const { gameState } = get()
    if (!gameState) return
    
    gameState.projectiles.delete(projectileId)
    set({ gameState: { ...gameState } })
  },
  
  addEffect: (effect) => {
    const { gameState } = get()
    if (!gameState) return
    
    gameState.effects.set(effect.id, effect)
    set({ gameState: { ...gameState } })
  },
  
  removeEffect: (effectId) => {
    const { gameState } = get()
    if (!gameState) return
    
    gameState.effects.delete(effectId)
    set({ gameState: { ...gameState } })
  },
  
  reset: () => set({
    gameState: null,
    currentPlayer: null,
    isInGame: false,
    roomId: null
  })
}))
