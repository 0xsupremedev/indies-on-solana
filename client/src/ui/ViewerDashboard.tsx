import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ViewerEffectType, EFFECT_PRICING } from '../../../shared/types'

interface ViewerDashboardProps {
  onClose: () => void
}

export function ViewerDashboard({ onClose }: ViewerDashboardProps) {
  const { publicKey, connected, wallet } = useWallet()
  const [selectedEffect, setSelectedEffect] = useState<ViewerEffectType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [balance, setBalance] = useState<number>(0)

  // Mock balance - in real implementation, this would fetch from Solana
  useEffect(() => {
    if (connected && publicKey) {
      // Simulate balance fetch
      setBalance(0.1) // 0.1 SOL
    }
  }, [connected, publicKey])

  const handleEffectClick = async (effectType: ViewerEffectType) => {
    if (!connected || !publicKey || isProcessing) return

    setSelectedEffect(effectType)
    setIsProcessing(true)

    try {
      // In real implementation, this would:
      // 1. Create a transaction with the effect type in memo
      // 2. Send SOL to the game wallet
      // 3. Wait for confirmation
      // 4. Notify the game server

      console.log(`Triggering effect: ${effectType}`)
      console.log(`Cost: ${EFFECT_PRICING[effectType]} SOL`)
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset state
      setSelectedEffect(null)
      setIsProcessing(false)
      
      // Show success message
      alert(`Effect "${effectType}" triggered successfully!`)
      
    } catch (error) {
      console.error('Error triggering effect:', error)
      setSelectedEffect(null)
      setIsProcessing(false)
      alert('Failed to trigger effect. Please try again.')
    }
  }

  const effects: { type: ViewerEffectType; name: string; description: string }[] = [
    { type: 'drop_health', name: 'Health Pack', description: 'Drop a health pickup' },
    { type: 'drop_ammo', name: 'Ammo Box', description: 'Drop an ammo pickup' },
    { type: 'drop_shield', name: 'Shield', description: 'Drop a shield pickup' },
    { type: 'spawn_laser', name: 'Laser Beam', description: 'Fire a laser beam' },
    { type: 'spawn_minion', name: 'Minion', description: 'Spawn an enemy minion' },
    { type: 'spawn_mine', name: 'Mine', description: 'Place an explosive mine' },
    { type: 'spawn_turret', name: 'Turret', description: 'Deploy a defense turret' },
    { type: 'gravity_flip', name: 'Gravity Flip', description: 'Reverse gravity for all players' },
    { type: 'slow_motion', name: 'Slow Motion', description: 'Slow down time briefly' },
    { type: 'rain_coins', name: 'Coin Rain', description: 'Make it rain coins!' }
  ]

  return (
    <div className="viewer-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>VIEWER DASHBOARD</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #00ffff',
            color: '#00ffff',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace'
          }}
        >
          ✕
        </button>
      </div>

      {!connected ? (
        <div className="wallet-connect">
          <p style={{ marginBottom: '15px', fontSize: '14px' }}>
            Connect your wallet to influence the game!
          </p>
          <WalletMultiButton className="connect-button" />
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>Connected Wallet</div>
            <div style={{ fontSize: '14px', wordBreak: 'break-all' }}>
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </div>
            <div style={{ fontSize: '12px', color: '#ffff00', marginTop: '5px' }}>
              Balance: {balance.toFixed(3)} SOL
            </div>
          </div>

          <div className="effect-grid">
            {effects.map((effect) => (
              <div key={effect.type} className="effect-item">
                <div className="effect-name">{effect.name}</div>
                <div className="effect-price">{EFFECT_PRICING[effect.type]} SOL</div>
                <button
                  className="effect-button"
                  onClick={() => handleEffectClick(effect.type)}
                  disabled={isProcessing || balance < EFFECT_PRICING[effect.type]}
                  style={{
                    opacity: balance < EFFECT_PRICING[effect.type] ? 0.5 : 1,
                    cursor: balance < EFFECT_PRICING[effect.type] ? 'not-allowed' : 'pointer'
                  }}
                >
                  {selectedEffect === effect.type && isProcessing ? 'PROCESSING...' : 'BUY'}
                </button>
                <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginTop: '5px' }}>
                  {effect.description}
                </div>
              </div>
            ))}
          </div>

          {isProcessing && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '15px', 
              color: '#00ffff',
              fontSize: '14px'
            }}>
              Processing transaction...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
