import { Connection, PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo } from '@solana/web3.js'
import { GameServer } from './gameServer.js'
import { ViewerEffect, ViewerEffectType } from '../../shared/types'

const ANCHOR_PROGRAM_ID = process.env.ANCHOR_PROGRAM_ID || 'EnterYourAnchorProgramIDHere'; // TODO: Fill in actual deployed address

export class BlockchainService {
  private connection: Connection
  private gameWallet: PublicKey
  private gameServer: GameServer
  private isMonitoring: boolean = false
  private lastProcessedSignature: string | null = null

  constructor(gameServer: GameServer) {
    // Use devnet for development, mainnet-beta for production
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    )
    
    // Game wallet address - in production, this would be a dedicated wallet
    this.gameWallet = new PublicKey(
      process.env.GAME_WALLET_ADDRESS || '11111111111111111111111111111112' // System Program as placeholder
    )
    
    this.gameServer = gameServer
  }

  async start() {
    console.log('🔗 Starting blockchain monitoring...')
    console.log(`📍 Monitoring wallet: ${this.gameWallet.toString()}`)
    
    this.isMonitoring = true
    
    // Start monitoring for transactions
    this.monitorTransactions()
  }

  private async monitorTransactions() {
    if (!this.isMonitoring) return

    try {
      // Get recent transactions for the game wallet
      const signatures = await this.connection.getSignaturesForAddress(
        this.gameWallet,
        { limit: 10 }
      )

      for (const signatureInfo of signatures) {
        // Skip if we've already processed this transaction
        if (this.lastProcessedSignature === signatureInfo.signature) {
          break
        }

        // Get transaction details
        const transaction = await this.connection.getParsedTransaction(
          signatureInfo.signature,
          { maxSupportedTransactionVersion: 0 }
        )

        if (transaction && this.containsAnchorEvent(transaction)) {
          await this.processAnchorEvents(transaction, signatureInfo.signature)
        }
        // fallback: legacy Sol tx check (for legacy/in-prod)
        else if (transaction && this.isValidGameTransaction(transaction)) {
          await this.processTransaction(transaction, signatureInfo.signature)
        }
      }

      // Update last processed signature
      if (signatures.length > 0) {
        this.lastProcessedSignature = signatures[0].signature
      }

    } catch (error) {
      console.error('Error monitoring transactions:', error)
    }

    // Continue monitoring every 2 seconds
    setTimeout(() => this.monitorTransactions(), 2000)
  }

  private isValidGameTransaction(transaction: ParsedTransactionWithMeta): boolean {
    // Check if transaction is successful
    if (transaction.meta?.err) return false

    // Check if transaction involves our game wallet
    const accounts = transaction.transaction.message.accountKeys
    const gameWalletString = this.gameWallet.toString()
    
    return accounts.some(account => account.pubkey.toString() === gameWalletString)
  }

  private containsAnchorEvent(transaction: ParsedTransactionWithMeta): boolean {
    // Anchor emits logs into the logMessages array
    const logMessages = transaction.meta?.logMessages || []
    return logMessages && logMessages.some(msg => msg.includes('event:'))
  }

  private async processAnchorEvents(transaction: ParsedTransactionWithMeta, signature: string) {
    try {
      const logMessages = transaction.meta?.logMessages || []
      for (const msg of logMessages) {
        // Very basic parse. Production should use Anchor event IDL parser
        if (msg.startsWith('Program log: event:')) {
          // Remove prefix
          const [, eventJson] = msg.split('event:')
          let eventObj
          try { eventObj = JSON.parse(eventJson) } catch (e) { continue }
          if (!eventObj) continue
          if (eventObj.MatchCreated) {
            // Relay to internal system (game, analytics, etc.)
            this.handleMatchCreated(eventObj.MatchCreated, signature)
          } else if (eventObj.PurchaseMade) {
            this.handlePurchaseMade(eventObj.PurchaseMade, signature)
          } else if (eventObj.MatchSettled) {
            this.handleMatchSettled(eventObj.MatchSettled, signature)
          }
        }
      }
      // TODO: Aggregate for advanced settlement after parsing (e.g., scoring)
    } catch (error) {
      console.error('Error processing anchor events:', error)
    }
  }

  private async processTransaction(transaction: ParsedTransactionWithMeta, signature: string) {
    try {
      // Extract transaction details
      const instructions = transaction.transaction.message.instructions
      const accounts = transaction.transaction.message.accountKeys
      
      // Find the sender (first account that's not the game wallet)
      const gameWalletString = this.gameWallet.toString()
      const senderAccount = accounts.find(account => 
        account.pubkey.toString() !== gameWalletString
      )

      if (!senderAccount) return

      const senderAddress = senderAccount.pubkey.toString()

      // Extract effect type from transaction memo or instruction data
      let effectType: ViewerEffectType = 'drop_health' // Default
      let amount = 0

      // Look for memo instruction
      for (const instruction of instructions) {
        if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
          amount = instruction.parsed.info.amount / 1e9 // Convert lamports to SOL
        }
      }

      // Determine effect type based on amount
      effectType = this.getEffectTypeFromAmount(amount)

      // Create viewer effect
      const effect: ViewerEffect = {
        id: `effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: effectType,
        position: this.getRandomPosition(),
        walletAddress: senderAddress,
        amount: amount,
        timestamp: Date.now(),
        transactionHash: signature
      }

      // Trigger effect in game
      this.gameServer.triggerViewerEffect(effect)

      console.log(`✅ Processed transaction: ${effectType} from ${senderAddress} (${amount} SOL)`)

    } catch (error) {
      console.error('Error processing transaction:', error)
    }
  }

  private getEffectTypeFromAmount(amount: number): ViewerEffectType {
    // Map SOL amounts to effect types
    if (amount >= 0.08) return 'rain_coins'
    if (amount >= 0.06) return 'spawn_turret'
    if (amount >= 0.05) return 'gravity_flip'
    if (amount >= 0.04) return 'slow_motion'
    if (amount >= 0.03) return 'spawn_minion'
    if (amount >= 0.025) return 'spawn_mine'
    if (amount >= 0.02) return 'spawn_laser'
    if (amount >= 0.015) return 'drop_shield'
    if (amount >= 0.01) return 'drop_health'
    return 'drop_ammo'
  }

  private getRandomPosition() {
    return {
      x: (Math.random() - 0.5) * 18, // Within arena bounds
      y: 1,
      z: (Math.random() - 0.5) * 18
    }
  }

  private handleMatchCreated(event: any, txid: string) {
    // Pass necessary parts of the event (match_addr, creator, timestamp)
    this.gameServer.newAnchorMatch({
      match_addr: event.match_addr,
      creator: event.creator,
      timestamp: event.timestamp,
    })
  }
  private handlePurchaseMade(event: any, txid: string) {
    this.gameServer.handleAnchorPurchase({
      buyer: event.buyer,
      match_addr: event.match_addr,
      effect_type: event.effect_type,
      amount: event.amount,
      timestamp: event.timestamp,
    })
  }
  private handleMatchSettled(event: any, txid: string) {
    this.gameServer.settleAnchorMatch({
      match_addr: event.match_addr,
      winner: event.winner,
      pot: event.pot,
      timestamp: event.timestamp,
    })
  }

  stop() {
    this.isMonitoring = false
    console.log('🛑 Blockchain monitoring stopped')
  }
}
