import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSocketStore } from '../stores/socketStore'

interface Room {
  id: string
  name: string
  players: number
  maxPlayers: number
  gameMode: string
  isActive: boolean
}

interface RoomBrowserProps {
  onCreateRoom: () => void
  onBack: () => void
}

export function RoomBrowser({ onCreateRoom, onBack }: RoomBrowserProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { socket } = useSocketStore()

  useEffect(() => {
    // Simulate loading rooms
    const timer = setTimeout(() => {
      setRooms([
        { id: 'room-1', name: 'Epic Battle Arena', players: 4, maxPlayers: 8, gameMode: 'Team Deathmatch', isActive: true },
        { id: 'room-2', name: 'Quick Play Zone', players: 2, maxPlayers: 4, gameMode: 'Free-for-All', isActive: true },
        { id: 'room-3', name: 'Viewer Chaos', players: 6, maxPlayers: 8, gameMode: 'Viewer Chaos', isActive: true },
        { id: 'room-4', name: 'Capture the Flag', players: 3, maxPlayers: 6, gameMode: 'Capture the Flag', isActive: false },
        { id: 'room-5', name: 'King of the Hill', players: 1, maxPlayers: 4, gameMode: 'King of the Hill', isActive: false }
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleJoinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId, 'Player' + Math.floor(Math.random() * 1000))
    }
  }

  const getGameModeColor = (gameMode: string) => {
    switch (gameMode) {
      case 'Team Deathmatch': return '#0088ff'
      case 'Free-for-All': return '#ff4444'
      case 'Capture the Flag': return '#00ff00'
      case 'King of the Hill': return '#ffff00'
      case 'Viewer Chaos': return '#ff00ff'
      default: return '#888888'
    }
  }

  return (
    <div className="room-browser">
      <div className="room-browser-container">
        {/* Header */}
        <motion.div
          className="room-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>ROOM BROWSER</h2>
          <div className="header-actions">
            <button className="refresh-button" onClick={() => setIsLoading(true)}>
              🔄 REFRESH
            </button>
            <button className="create-button" onClick={onCreateRoom}>
              ➕ CREATE ROOM
            </button>
            <button className="back-button" onClick={onBack}>
              ← BACK
            </button>
          </div>
        </motion.div>

        {/* Room List */}
        <motion.div
          className="room-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="loading-rooms">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  className={`room-card ${room.isActive ? 'active' : 'inactive'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <div className="room-details">
                      <span className="game-mode" style={{ color: getGameModeColor(room.gameMode) }}>
                        {room.gameMode}
                      </span>
                      <span className="player-count">
                        {room.players}/{room.maxPlayers} players
                      </span>
                    </div>
                  </div>
                  
                  <div className="room-status">
                    <div className={`status-indicator ${room.isActive ? 'active' : 'inactive'}`}>
                      {room.isActive ? '●' : '○'}
                    </div>
                    <span className="status-text">
                      {room.isActive ? 'Active' : 'Waiting'}
                    </span>
                  </div>

                  <button
                    className="join-button"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={!room.isActive || room.players >= room.maxPlayers}
                  >
                    {room.players >= room.maxPlayers ? 'FULL' : 'JOIN'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="room-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat">
            <span className="stat-label">Total Rooms:</span>
            <span className="stat-value">{rooms.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Active Players:</span>
            <span className="stat-value">{rooms.reduce((sum, room) => sum + room.players, 0)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Available Slots:</span>
            <span className="stat-value">{rooms.reduce((sum, room) => sum + (room.maxPlayers - room.players), 0)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
