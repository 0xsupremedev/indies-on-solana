import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { MainMenuBackground } from './MainMenuBackground'
import { soundManager } from '../audio/SoundManager'

interface MainMenuProps {
  onStartGame: () => void
  onJoinRoom: () => void
  onCreateRoom: () => void
  onSettings: () => void
}

export function MainMenu({ onStartGame, onJoinRoom, onCreateRoom, onSettings }: MainMenuProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickPlay = () => {
    soundManager.playSound('click')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onStartGame()
    }, 1000)
  }

  const handleButtonClick = (callback: () => void) => {
    soundManager.playSound('click')
    callback()
  }

  const handleButtonHover = () => {
    soundManager.playSound('hover')
  }

  return (
    <div className="main-menu">
      {/* 3D Background */}
      <div className="background-canvas">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <MainMenuBackground />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        <motion.div
          className="menu-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            className="logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <h1>COIN WARS 3D</h1>
            <p>Live Arena Shooter</p>
          </motion.div>

          {/* Menu Buttons */}
          <motion.div
            className="menu-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="menu-button primary"
              onClick={handleQuickPlay}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 'JOINING...' : 'QUICK PLAY'}
            </motion.button>

            <motion.button
              className="menu-button"
              onClick={() => handleButtonClick(onJoinRoom)}
              onMouseEnter={handleButtonHover}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              JOIN ROOM
            </motion.button>

            <motion.button
              className="menu-button"
              onClick={() => handleButtonClick(onCreateRoom)}
              onMouseEnter={handleButtonHover}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CREATE ROOM
            </motion.button>

            <motion.button
              className="menu-button"
              onClick={() => handleButtonClick(onSettings)}
              onMouseEnter={handleButtonHover}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SETTINGS
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="menu-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Built for Indies On Solana Hackathon</p>
            <p>Powered by Solana Blockchain</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loading-spinner"></div>
          <p>Finding a match...</p>
        </motion.div>
      )}
    </div>
  )
}
