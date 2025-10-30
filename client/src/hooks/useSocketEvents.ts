import { useEffect } from 'react'
import { useSocketStore } from '../stores/socketStore'
import { useGameStore } from '../stores/gameStore'

export function useSocketEvents() {
  const { socket } = useSocketStore()
  const { setGameState, setCurrentPlayer, updatePlayer, addProjectile, removeProjectile, addEffect } = useGameStore()

  useEffect(() => {
    if (!socket || typeof (socket as any).on !== 'function') return

    const handleGameState = (gameState: any) => {
      setGameState(gameState)
    }

    const handlePlayerJoined = (player: any) => {
      console.log('Player joined:', player)
    }

    const handlePlayerLeft = (playerId: string) => {
      console.log('Player left:', playerId)
    }

    const handlePlayerMove = (player: any) => {
      updatePlayer(player.id, player)
    }

    const handlePlayerHit = (playerId: string, damage: number, attackerId: string) => {
      // Server is authoritative; local UI reacts via periodic gameState
      console.log(`Player ${playerId} hit for ${damage} damage by ${attackerId}`)
    }

    const handlePlayerDied = (playerId: string, killerId: string) => {
      // Optimistic UI marker; server will sync
      updatePlayer(playerId, { isAlive: false, health: 0 } as any)
      console.log(`Player ${playerId} died, killed by ${killerId}`)
    }

    const handleRoundEnd = (winner: any, rewardLamports?: number) => {
      console.log('Round ended. Winner:', winner?.name || 'None', 'rewardLamports:', rewardLamports)
      const addEventFeed = (window as any).addEventFeed as ((item: { message: string, txid?: string }) => void) | undefined
      if (addEventFeed) {
        const sol = rewardLamports ? (rewardLamports / 1e9).toFixed(3) : undefined
        addEventFeed({ message: `Winner: ${winner?.name || 'None'}${sol ? ` +${sol} SOL` : ''}` })
      }
    }

    const handleEffectTriggered = (effect: any) => {
      addEffect(effect)
    }

    const handleProjectileCreated = (projectile: any) => {
      addProjectile(projectile)
    }

    // Additional event handlers for Anchor events (on-chain)
    const handleAnchorMatchCreated = (data: { matchId: string, creator: string, timestamp: number }) => {
      console.log('[Anchor] Match Created:', data)
      // TODO: Optionally update state/HUD, e.g., show new match in UI
    }
    // --- Event Feed integration ---
    // Event Feed integration - set up addEventFeed with type assertion for TS
    const addEventFeed = (window as any).addEventFeed as ((item: { message: string, txid?: string }) => void) | undefined;

    const handleAnchorPurchase = (data: { buyer: string, match_addr: string, effect_type: number, amount: string, timestamp: number, txid?: string }) => {
      console.log('[Anchor] Purchase:', data);
      let effectMsg = '';
      switch (data.effect_type) {
        case 1: effectMsg = 'dropped a Health Pack!'; break;
        case 2: effectMsg = 'spawned an Enemy Bot!'; break;
        case 3: effectMsg = 'flipped Gravity!'; break;
        default: effectMsg = 'triggered an action!';
      }
      if (addEventFeed)
        addEventFeed({ message: `Viewer@${data.buyer.slice(0, 6)} ${effectMsg}`, txid: data.txid })
      // Optionally, trigger effect spawn: e.g. addEffect(...)
    }
    const handleAnchorMatchSettled = (data: { match_addr: string, winner?: string, pot: string, timestamp: number }) => {
      console.log('[Anchor] Match Settled:', data)
      // TODO: Optionally update state/HUD, e.g., flash settlement animation
    }

    // Register new event listeners with proper typings
    (socket.on as any)('anchorMatchCreated', handleAnchorMatchCreated)
    ;(socket.on as any)('anchorPurchase', handleAnchorPurchase)
    ;(socket.on as any)('anchorMatchSettled', handleAnchorMatchSettled)

    // Register base listeners
    (socket.on as any)('gameState', handleGameState)
    (socket.on as any)('playerJoined', handlePlayerJoined)
    (socket.on as any)('playerLeft', handlePlayerLeft)
    (socket.on as any)('playerMove', handlePlayerMove)
    (socket.on as any)('playerHit', handlePlayerHit)
    (socket.on as any)('playerDied', handlePlayerDied)
    (socket.on as any)('effectTriggered', handleEffectTriggered)
    (socket.on as any)('projectileCreated', handleProjectileCreated)
    (socket.on as any)('roundEnd', handleRoundEnd)

    // Cleanup
    return () => {
      (socket.off as any)('gameState', handleGameState)
      (socket.off as any)('playerJoined', handlePlayerJoined)
      (socket.off as any)('playerLeft', handlePlayerLeft)
      (socket.off as any)('playerMove', handlePlayerMove)
      (socket.off as any)('playerHit', handlePlayerHit)
      (socket.off as any)('playerDied', handlePlayerDied)
      (socket.off as any)('effectTriggered', handleEffectTriggered)
      (socket.off as any)('projectileCreated', handleProjectileCreated)
      (socket.off as any)('anchorMatchCreated', handleAnchorMatchCreated)
      ;(socket.off as any)('anchorPurchase', handleAnchorPurchase)
      ;(socket.off as any)('anchorMatchSettled', handleAnchorMatchSettled)
      (socket.off as any)('roundEnd', handleRoundEnd)
    }
  }, [socket, setGameState, setCurrentPlayer, updatePlayer, addProjectile, removeProjectile, addEffect])
}
