import { useState, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'

interface KillEvent {
  id: string
  killer: string
  victim: string
  weapon: string
  timestamp: number
}

interface PlayerStats {
  id: string
  name: string
  kills: number
  deaths: number
  assists: number
  score: number
}

interface EventFeedItem {
  id: string;
  message: string;
  txid?: string;
}

declare global {
  interface Window {
    addEventFeed?: (item: Omit<EventFeedItem, 'id'>) => void;
  }
}

export function GameHUD() {
  const { currentPlayer, gameState } = useGameStore()
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [killFeed, setKillFeed] = useState<KillEvent[]>([])
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map())
  const [eventFeed, setEventFeed] = useState<EventFeedItem[]>([]);

  // Simulate kill feed updates with more realistic names
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) { // 15% chance every second
        const killers = ['EnemyBot Dot (Shyper)', 'EnemyBot (Assault + Mlicio)', 'Player22 (Sniper)', 'Players Micos Orta', 'Slayer5', 'Slayer3']
        const victims = ['EnemyBot2', 'Player4', 'Player5', 'Player6', 'Bot3']
        const weapons = ['Assault Rifle', 'Shotgun', 'Sniper', 'Rocket Launcher', 'SMG']
        
        const newKill: KillEvent = {
          id: Date.now().toString(),
          killer: killers[Math.floor(Math.random() * killers.length)],
          victim: victims[Math.floor(Math.random() * victims.length)],
          weapon: weapons[Math.floor(Math.random() * weapons.length)],
          timestamp: Date.now()
        }
        
        setKillFeed(prev => [newKill, ...prev.slice(0, 4)]) // Keep last 5 kills
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update player stats
  useEffect(() => {
    if (gameState) {
      const stats = new Map<string, PlayerStats>()
      gameState.players.forEach((player, id) => {
        stats.set(id, {
          id,
          name: player.name,
          kills: Math.floor(Math.random() * 10), // Simulated data
          deaths: Math.floor(Math.random() * 5),
          assists: Math.floor(Math.random() * 8),
          score: Math.floor(Math.random() * 1000)
        })
      })
      setPlayerStats(stats)
    }
  }, [gameState])

  // Render event notifications
  useEffect(() => {
    // Expose addEventFeed to global for socket event-to-popup (TEMP).
    // In prod, use context/store!  
    window.addEventFeed = addEventFeed
    return () => { delete window.addEventFeed }
  }, [])

  const addEventFeed = (item: Omit<EventFeedItem, "id">) => {
    const event = { id: Date.now() + Math.random().toString(), ...item };
    setEventFeed((prev) => [event, ...prev].slice(0, 5));
    setTimeout(() => {
      setEventFeed((prev) => prev.filter((e) => e.id !== event.id));
    }, 3000);
  };

  if (!currentPlayer || !gameState) {
    return null
  }

  const score = playerStats.get(currentPlayer.id)?.score || 0

  // Calculate team health
  const blueTeamPlayers = Array.from(gameState.players.values()).filter(p => p.team === 'blue')
  const redTeamPlayers = Array.from(gameState.players.values()).filter(p => p.team === 'red')
  
  const blueTeamHealth = blueTeamPlayers.reduce((total, player) => total + player.health, 0)
  const blueTeamMaxHealth = blueTeamPlayers.reduce((total, player) => total + player.maxHealth, 0)
  const blueTeamHealthPercent = blueTeamMaxHealth > 0 ? (blueTeamHealth / blueTeamMaxHealth) * 100 : 100
  
  const redTeamHealth = redTeamPlayers.reduce((total, player) => total + player.health, 0)
  const redTeamMaxHealth = redTeamPlayers.reduce((total, player) => total + player.maxHealth, 0)
  const redTeamHealthPercent = redTeamMaxHealth > 0 ? (redTeamHealth / redTeamMaxHealth) * 100 : 100

  return (
    <div className="game-ui">
      {/* Blue Team Health Bar (Left) */}
      <div className="team-health-left">
        <div className="team-health-text">
          SCORE: BCDE {score} - HEALTH
        </div>
        <div className="team-health-bar blue">
          <div 
            className="team-health-fill blue" 
            style={{ width: `${blueTeamHealthPercent}%` }}
          />
        </div>
        <div className="team-health-label">BLUE TEAM HEALTH</div>
      </div>

      {/* Red Team Health Bar (Right) */}
      <div className="team-health-right">
        <div className="team-health-label">RED TEAM HEALTH</div>
        <div className="team-health-bar red">
          <div 
            className="team-health-fill red" 
            style={{ width: `${redTeamHealthPercent}%` }}
          />
        </div>
      </div>

      {/* Player Label */}
      <div className="player-label">
        Player
      </div>

      {/* Mini-map */}
      <div className="minimap">
        <div className="minimap-header">MINI-MAP</div>
        <div className="minimap-container">
          <div className="minimap-grid">
            {Array.from(gameState.players.values()).map((player) => (
              <div
                key={player.id}
                className={`minimap-player ${player.team} ${player.id === currentPlayer.id ? 'current' : ''}`}
                style={{
                  left: `${50 + (player.position.x / 20) * 100}%`,
                  top: `${50 + (player.position.z / 20) * 100}%`
                }}
              >
                ●
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Kill Feed */}
      <div className="kill-feed">
        {killFeed.map((kill) => (
          <div key={kill.id} className="kill-event">
            <span className="killer">{kill.killer}</span>
            <span className="weapon">({kill.weapon})</span>
            <span className="victim">{kill.victim}</span>
          </div>
        ))}
      </div>

      {/* Scoreboard Toggle */}
      <div className="scoreboard-toggle">
        <button
          onMouseDown={() => setShowScoreboard(true)}
          onMouseUp={() => setShowScoreboard(false)}
          onMouseLeave={() => setShowScoreboard(false)}
          className="scoreboard-button"
        >
          TAB - SCOREBOARD
        </button>
      </div>

      {/* Scoreboard */}
      {showScoreboard && (
        <div className="scoreboard">
          <div className="scoreboard-header">
            <h3>SCOREBOARD</h3>
            <div className="scoreboard-stats">
              <span>KILLS</span>
              <span>DEATHS</span>
              <span>ASSISTS</span>
              <span>SCORE</span>
            </div>
          </div>
          <div className="scoreboard-players">
            {Array.from(playerStats.values())
              .sort((a, b) => b.score - a.score)
              .map((player) => (
                <div key={player.id} className={`scoreboard-player ${player.id === currentPlayer.id ? 'current' : ''}`}>
                  <span className="player-name">{player.name}</span>
                  <span className="player-kills">{player.kills}</span>
                  <span className="player-deaths">{player.deaths}</span>
                  <span className="player-assists">{player.assists}</span>
                  <span className="player-score">{player.score}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Event Notification Feed */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 20
      }}>
        {eventFeed.map(ev => (
          <div key={ev.id} style={{
            background: 'rgba(0,255,255,0.16)',
            color: '#00ffff',
            padding: '6px 16px',
            borderRadius: 6,
            fontWeight: 'bold',
            marginBottom: 6,
            boxShadow: '0 0 10px #00ffff77',
            fontFamily: 'monospace',
            textShadow: '0 0 5px #08081c',
            minWidth: 210,
            textAlign: 'center',
            animation: 'fade-in-out 3s',
          }}>
            {ev.message}
            {ev.txid && <><br /><span style={{ fontSize: 12, color: '#44e1ff', opacity: 0.74 }}>Tx: {ev.txid.slice(0,10)}...</span></>}
          </div>
        ))}
      </div>

      {/* Game Status */}
      {!gameState.isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#00ffff',
          fontSize: '24px',
          textAlign: 'center',
          textShadow: '0 0 10px #00ffff'
        }}>
          WAITING FOR PLAYERS...
        </div>
      )}

      {/* Death Screen */}
      {!currentPlayer.isAlive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff0000',
          fontSize: '32px',
          textAlign: 'center',
          textShadow: '0 0 15px #ff0000'
        }}>
          YOU DIED!
          <div style={{ fontSize: '18px', marginTop: '10px' }}>
            Waiting for respawn...
          </div>
        </div>
      )}
    </div>
  )
}
