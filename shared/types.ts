// Shared types for Coin Wars 3D

export interface Player {
  id: string;
  name: string;
  position: Vector3;
  rotation: Vector3;
  health: number;
  maxHealth: number;
  team: 'blue' | 'red';
  isAlive: boolean;
  lastUpdate: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Projectile {
  id: string;
  position: Vector3;
  direction: Vector3;
  speed: number;
  damage: number;
  ownerId: string;
  type: 'bullet' | 'laser' | 'rocket';
  lifetime: number;
}

export interface ViewerEffect {
  id: string;
  type: ViewerEffectType;
  position?: Vector3;
  targetPlayerId?: string;
  walletAddress: string;
  amount: number;
  timestamp: number;
  transactionHash: string;
}

export type ViewerEffectType = 
  | 'drop_health'
  | 'drop_ammo'
  | 'drop_shield'
  | 'spawn_laser'
  | 'spawn_minion'
  | 'spawn_mine'
  | 'gravity_flip'
  | 'slow_motion'
  | 'spawn_turret'
  | 'rain_coins';

export interface GameState {
  players: Map<string, Player>;
  projectiles: Map<string, Projectile>;
  effects: Map<string, ViewerEffect>;
  gameTime: number;
  roundNumber: number;
  isActive: boolean;
  gravity: Vector3;
  timeScale: number;
}

export interface Room {
  id: string;
  name: string;
  players: Map<string, Player>;
  maxPlayers: number;
  gameMode: '1v1' | '2v2' | 'ffa';
  isActive: boolean;
  createdAt: number;
}

export interface ViewerSpender {
  walletAddress: string;
  nickname: string;
  totalSpent: number;
  effectCount: number;
  lastActivity: number;
}

export type EffectPricing = {
  [key in ViewerEffectType]: number;
};

export const EFFECT_PRICING: EffectPricing = {
  drop_health: 0.01,
  drop_ammo: 0.01,
  drop_shield: 0.015,
  spawn_laser: 0.02,
  spawn_minion: 0.03,
  spawn_mine: 0.025,
  gravity_flip: 0.05,
  slow_motion: 0.04,
  spawn_turret: 0.06,
  rain_coins: 0.08
};

// Socket.io event types
export interface ServerToClientEvents {
  gameState: (state: GameState) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  effectTriggered: (effect: ViewerEffect) => void;
  playerHit: (playerId: string, damage: number, attackerId: string) => void;
  playerDied: (playerId: string, killerId: string) => void;
  roundEnd: (winner: Player | null, rewardLamports?: number) => void;
  projectileCreated: (projectile: Projectile) => void;
  anchorMatchCreated: (event: { matchId: string, creator: string, timestamp: number }) => void;
  anchorPurchase: (event: { buyer: string, match_addr: string, effect_type: number, amount: string, timestamp: number }) => void;
  anchorMatchSettled: (event: { match_addr: string, winner?: string, pot: string, timestamp: number }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  playerMove: (position: Vector3, rotation: Vector3) => void;
  playerShoot: (direction: Vector3, projectileType: string) => void;
  requestGameState: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId: string;
  roomId: string;
  playerName: string;
}
