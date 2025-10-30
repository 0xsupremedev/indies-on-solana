import React from 'react'

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <div>Loading Coin Wars 3D...</div>
      <div style={{ fontSize: '16px', marginTop: '10px', color: '#888' }}>
        Preparing the arena for battle
      </div>
    </div>
  )
}
