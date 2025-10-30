import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface PlayerCustomizationProps {
  onConfirm: (playerData: { name: string, team: 'blue' | 'red', skin: string }) => void
  onBack: () => void
}

export function PlayerCustomization({ onConfirm, onBack }: PlayerCustomizationProps) {
  const [playerName, setPlayerName] = useState('Player' + Math.floor(Math.random() * 1000))
  const [selectedTeam, setSelectedTeam] = useState<'blue' | 'red'>('blue')
  const [selectedSkin, setSelectedSkin] = useState('default')

  const skins = [
    { id: 'default', name: 'Default', color: '#ffffff' },
    { id: 'neon', name: 'Neon', color: '#00ffff' },
    { id: 'cyber', name: 'Cyber', color: '#ff00ff' },
    { id: 'stealth', name: 'Stealth', color: '#333333' },
    { id: 'gold', name: 'Gold', color: '#ffd700' }
  ]

  const handleConfirm = () => {
    onConfirm({
      name: playerName,
      team: selectedTeam,
      skin: selectedSkin
    })
  }

  return (
    <div className="player-customization">
      <div className="customization-container">
        {/* Header */}
        <motion.div
          className="customization-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>PLAYER CUSTOMIZATION</h2>
          <button className="back-button" onClick={onBack}>
            ← BACK
          </button>
        </motion.div>

        {/* Player Name */}
        <motion.div
          className="customization-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Player Name</h3>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={20}
            className="name-input"
          />
        </motion.div>

        {/* Team Selection */}
        <motion.div
          className="customization-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Team</h3>
          <div className="team-selection">
            <motion.button
              className={`team-button blue ${selectedTeam === 'blue' ? 'selected' : ''}`}
              onClick={() => setSelectedTeam('blue')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="team-color blue"></div>
              <span>BLUE TEAM</span>
            </motion.button>
            
            <motion.button
              className={`team-button red ${selectedTeam === 'red' ? 'selected' : ''}`}
              onClick={() => setSelectedTeam('red')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="team-color red"></div>
              <span>RED TEAM</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Skin Selection */}
        <motion.div
          className="customization-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Skin</h3>
          <div className="skin-selection">
            {skins.map((skin, index) => (
              <motion.button
                key={skin.id}
                className={`skin-button ${selectedSkin === skin.id ? 'selected' : ''}`}
                onClick={() => setSelectedSkin(skin.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="skin-preview"
                  style={{ backgroundColor: skin.color }}
                ></div>
                <span>{skin.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          className="customization-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Preview</h3>
          <div className="player-preview">
            <div className={`preview-character ${selectedTeam}`}>
              <div 
                className="character-body"
                style={{ backgroundColor: skins.find(s => s.id === selectedSkin)?.color }}
              ></div>
              <div className="character-name">{playerName}</div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="customization-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button className="confirm-button" onClick={handleConfirm}>
            CONFIRM & JOIN
          </button>
        </motion.div>
      </div>
    </div>
  )
}
