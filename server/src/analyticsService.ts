import { Server } from 'socket.io'
import { ViewerSpender, ViewerEffect } from '../../shared/types'

export class AnalyticsService {
  private spenders: Map<string, ViewerSpender> = new Map()
  private recentActions: ViewerEffect[] = []
  private io: Server

  constructor(io: Server) {
    this.io = io
  }

  recordViewerAction(effect: ViewerEffect) {
    // Update spender data
    const walletAddress = effect.walletAddress
    const existingSpender = this.spenders.get(walletAddress)
    
    if (existingSpender) {
      existingSpender.totalSpent += effect.amount
      existingSpender.effectCount += 1
      existingSpender.lastActivity = Date.now()
    } else {
      this.spenders.set(walletAddress, {
        walletAddress,
        nickname: this.generateNickname(walletAddress),
        totalSpent: effect.amount,
        effectCount: 1,
        lastActivity: Date.now()
      })
    }

    // Add to recent actions
    this.recentActions.unshift(effect)
    
    // Keep only last 50 actions
    if (this.recentActions.length > 50) {
      this.recentActions = this.recentActions.slice(0, 50)
    }

    // Broadcast update to overlay
    this.broadcastAnalyticsUpdate()
  }

  private generateNickname(walletAddress: string): string {
    // Generate a friendly nickname from wallet address
    const adjectives = ['Cool', 'Epic', 'Awesome', 'Legendary', 'Mega', 'Super', 'Ultra', 'Pro']
    const nouns = ['Player', 'Gamer', 'Warrior', 'Champion', 'Hero', 'Master', 'Boss', 'King']
    
    const hash = walletAddress.slice(2, 6) // Use first 4 chars as seed
    const seed = parseInt(hash, 16)
    
    const adjIndex = seed % adjectives.length
    const nounIndex = Math.floor(seed / adjectives.length) % nouns.length
    
    return `${adjectives[adjIndex]}${nouns[nounIndex]}`
  }

  getLeaderboard(): ViewerSpender[] {
    return Array.from(this.spenders.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10) // Top 10
  }

  getRecentActions(): ViewerEffect[] {
    return this.recentActions.slice(0, 15) // Last 15 actions
  }

  getSpenderStats(walletAddress: string): ViewerSpender | null {
    return this.spenders.get(walletAddress) || null
  }

  private broadcastAnalyticsUpdate() {
    const leaderboard = this.getLeaderboard()
    const recentActions = this.getRecentActions()
    
    // Broadcast to overlay clients
    this.io.emit('analyticsUpdate', {
      leaderboard,
      recentActions,
      timestamp: Date.now()
    })
  }

  // Reset data (useful for new rounds)
  reset() {
    this.spenders.clear()
    this.recentActions = []
  }
}
