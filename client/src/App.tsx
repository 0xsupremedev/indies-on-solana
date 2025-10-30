import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameScene } from './game/scenes/GameScene'
import { ViewerDashboard } from './ui/ViewerDashboard'
import { GameHUD } from './ui/GameHUD'
import { WeaponHUD } from './ui/WeaponHUD'
import { LoadingScreen } from './ui/LoadingScreen'
import { MainMenu } from './ui/MainMenu'
import { RoomBrowser } from './ui/RoomBrowser'
import { PlayerCustomization } from './ui/PlayerCustomization'
import { WalletContextProvider } from './WalletProvider'
import { useGameStore } from './stores/gameStore'
import { useSocketStore } from './stores/socketStore'
import { useSocketEvents } from './hooks/useSocketEvents'
import { musicManager } from './audio/MusicManager'
import { WEAPONS, Weapon } from './game/weapons/WeaponSystem'

type AppState = 'loading' | 'menu' | 'room-browser' | 'customization' | 'game'

const IS_DEV_DEMO = true; // Set false to restore menu navigation
const SERVER_URL = (import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:8888'

function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [showViewerDashboard, setShowViewerDashboard] = useState(false)
  const [currentWeapon, setCurrentWeapon] = useState<Weapon>(WEAPONS[0])
  const { isConnected, connect } = useSocketStore()
  const { gameState, setGameState, setCurrentPlayer } = useGameStore()

  // Set up socket event handlers
  useSocketEvents()

  useEffect(() => {
    // Try to connect to server, but don't block if it fails
    try {
      connect(SERVER_URL)
    } catch (error) {
      console.warn('Failed to connect to server:', error)
    }
    
    // Start menu music
    musicManager.playTrack('menu')
    
    // Demo: auto-join game (skip menu) in dev
    const timer = setTimeout(() => {
      if (IS_DEV_DEMO) {
        const { socket } = useSocketStore.getState()
        if (socket) {
          socket.emit('joinRoom', 'demo-room', 'Player')
        }
        setAppState('game')
      } else {
        setAppState('menu')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [connect])

  // Handle music changes based on app state
  useEffect(() => {
    switch (appState) {
      case 'menu':
        musicManager.playTrack('menu')
        break
      case 'room-browser':
      case 'customization':
        musicManager.playTrack('lobby')
        break
      case 'game':
        musicManager.playTrack('game')
        break
    }
  }, [appState])

  const handleStartGame = () => {
    setAppState('customization')
  }

  const handleJoinRoom = () => {
    setAppState('room-browser')
  }

  const handleCreateRoom = () => {
    setAppState('customization')
  }

  const handleSettings = () => {
    // TODO: Implement settings
    console.log('Settings clicked')
  }

  const handleBackToMenu = () => {
    setAppState('menu')
  }

  const handlePlayerCustomized = (playerData: { name: string, team: 'blue' | 'red', skin: string }) => {
    // Auto-join demo room
    const { socket } = useSocketStore.getState()
    if (socket) {
      socket.emit('joinRoom', 'demo-room', playerData.name)
    }
    setAppState('game')
  }

  const toggleViewerDashboard = () => {
    setShowViewerDashboard(!showViewerDashboard)
  }

  const handleWeaponChange = (weapon: Weapon) => {
    setCurrentWeapon(weapon)
  }

  if (appState === 'loading') {
    return <LoadingScreen />
  }

  if (appState === 'menu') {
    return (
      <MainMenu
        onStartGame={handleStartGame}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        onSettings={handleSettings}
      />
    )
  }

  if (appState === 'room-browser') {
    return (
      <RoomBrowser
        onCreateRoom={handleCreateRoom}
        onBack={handleBackToMenu}
      />
    )
  }

  if (appState === 'customization') {
    return (
      <PlayerCustomization
        onConfirm={handlePlayerCustomized}
        onBack={handleBackToMenu}
      />
    )
  }

  return (
    <WalletContextProvider>
      <div className="App" style={{ width: '100vw', height: '100vh', position: 'relative', background: 'black' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Canvas
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            camera={{ 
              position: [0, 10, 15], 
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            shadows
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <GameScene />
          </Canvas>
        </div>

        <div className="game-ui" style={{ zIndex: 2 }}>
          <GameHUD />
          <WeaponHUD currentWeapon={currentWeapon} onWeaponChange={handleWeaponChange} />
          
          {showViewerDashboard && (
            <ViewerDashboard onClose={() => setShowViewerDashboard(false)} />
          )}
          
          {!showViewerDashboard && (
            <button
              onClick={toggleViewerDashboard}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                background: 'rgba(0, 255, 255, 0.2)',
                border: '1px solid #00ffff',
                color: '#00ffff',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                pointerEvents: 'auto'
              }}
            >
              Viewer Devtacord
            </button>
          )}

          {/* Back to Menu Button */}
          <button
            onClick={handleBackToMenu}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: 'rgba(255, 68, 68, 0.2)',
              border: '1px solid #ff4444',
              color: '#ff4444',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              fontSize: '12px',
              pointerEvents: 'auto'
            }}
          >
            ← MENU
          </button>
        </div>
      </div>
    </WalletContextProvider>
  )
}

export default App
