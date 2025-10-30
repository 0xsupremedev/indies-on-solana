import React, { useState, useEffect } from 'react'
import { WEAPONS, Weapon } from '../game/weapons/WeaponSystem'

interface WeaponHUDProps {
  currentWeapon: Weapon
  onWeaponChange: (weapon: Weapon) => void
}

export function WeaponHUD({ currentWeapon, onWeaponChange }: WeaponHUDProps) {
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0)
  const [isReloading, setIsReloading] = useState(false)
  const [reloadProgress, setReloadProgress] = useState(0)

  // Handle weapon switching with number keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key
      if (key >= '1' && key <= '6') {
        const weaponIndex = parseInt(key) - 1
        if (weaponIndex < WEAPONS.length) {
          setSelectedWeaponIndex(weaponIndex)
          onWeaponChange(WEAPONS[weaponIndex])
        }
      }
      
      // R key for reload
      if (key.toLowerCase() === 'r' && !isReloading) {
        handleReload()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isReloading])

  const handleReload = () => {
    if (isReloading || currentWeapon.ammo === currentWeapon.maxAmmo) return
    
    setIsReloading(true)
    setReloadProgress(0)
    
    const reloadInterval = setInterval(() => {
      setReloadProgress(prev => {
        const newProgress = prev + (100 / (currentWeapon.reloadTime * 60)) // 60 FPS
        if (newProgress >= 100) {
          clearInterval(reloadInterval)
          setIsReloading(false)
          // Reload complete - restore ammo
          onWeaponChange({
            ...currentWeapon,
            ammo: currentWeapon.maxAmmo
          })
          return 100
        }
        return newProgress
      })
    }, 1000 / 60) // 60 FPS
  }

  return (
    <div className="weapon-hud">
      {/* Current Weapon Display */}
      <div className="current-weapon">
        <div className="weapon-icon">🛡️</div>
        <div className="weapon-info">
          <div className="weapon-name">{currentWeapon.name}</div>
          <div className="weapon-ammo">
            {currentWeapon.ammo} / {currentWeapon.maxAmmo}
          </div>
        </div>
      </div>

      {/* Weapon Selector - 2x3 Grid */}
      <div className="weapon-selector">
        {WEAPONS.map((weapon, index) => (
          <div
            key={weapon.id}
            className={`weapon-slot ${index === selectedWeaponIndex ? 'selected' : ''}`}
            onClick={() => {
              setSelectedWeaponIndex(index)
              onWeaponChange(weapon)
            }}
          >
            <div className="slot-number">{index + 1}</div>
            <div className="slot-icon">{weapon.icon}</div>
            <div className="slot-name">{weapon.name}</div>
            <div className="slot-ammo">{weapon.ammo}</div>
          </div>
        ))}
      </div>

      {/* Reload Progress */}
      {isReloading && (
        <div className="reload-indicator">
          <div className="reload-text">RELOADING...</div>
          <div className="reload-bar">
            <div 
              className="reload-progress"
              style={{ width: `${reloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Weapon Stats */}
      <div className="weapon-stats">
        <div className="stat">
          <span className="stat-label">DAMCRIT! {currentWeapon.damage}</span>
        </div>
        <div className="stat">
          <span className="stat-label">RANGE! {currentWeapon.range}m</span>
        </div>
        <div className="stat">
          <span className="stat-label">FIRE RATE! {currentWeapon.fireRate}s</span>
        </div>
        <div className="stat">
          <span className="stat-label">ACCURACY! {Math.round(currentWeapon.accuracy * 100)}%</span>
        </div>
      </div>
    </div>
  )
}
