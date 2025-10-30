import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Text } from '@react-three/drei'
import { Mesh, Group } from 'three'
import { Player as PlayerType } from '../../../shared/types'

interface PlayerProps {
  player: PlayerType
  isCurrentPlayer: boolean
}

export function Player({ player, isCurrentPlayer }: PlayerProps) {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<Mesh>(null)
  const weaponRef = useRef<Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Smooth position interpolation
      groupRef.current.position.lerp(
        { x: player.position.x, y: player.position.y, z: player.position.z } as any,
        0.1
      )
      
      // Smooth rotation interpolation
      groupRef.current.rotation.set(
        player.rotation.x,
        player.rotation.y,
        player.rotation.z
      )
    }
  })

  // Health bar animation
  useEffect(() => {
    if (bodyRef.current) {
      const healthPercent = player.health / player.maxHealth
      
      if (healthPercent < 0.3) {
        // Low health - red pulsing
        bodyRef.current.material.emissive.setHex(0xff0000)
        bodyRef.current.material.emissiveIntensity = 0.3
      } else if (healthPercent < 0.6) {
        // Medium health - yellow
        bodyRef.current.material.emissive.setHex(0xffff00)
        bodyRef.current.material.emissiveIntensity = 0.1
      } else {
        // Full health - team color
        bodyRef.current.material.emissive.setHex(0x000000)
        bodyRef.current.material.emissiveIntensity = 0
      }
    }
  }, [player.health, player.maxHealth])

  const teamColor = player.team === 'blue' ? '#0088ff' : '#ff4444'
  const isAlive = player.isAlive

  return (
    <group ref={groupRef}>
      {/* Player Body - Enhanced Blocky Design */}
      <Box
        ref={bodyRef}
        position={[0, 1, 0]}
        args={[1.4, 2.2, 1]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
          emissive={teamColor}
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Player Head - More Blocky */}
      <Box
        position={[0, 2.8, 0]}
        args={[0.8, 0.8, 0.8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
          emissive={teamColor}
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Arms */}
      <Box
        position={[-0.8, 1.5, 0]}
        args={[0.3, 1, 0.3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      <Box
        position={[0.8, 1.5, 0]}
        args={[0.3, 1, 0.3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* Legs */}
      <Box
        position={[-0.3, 0.3, 0]}
        args={[0.4, 0.6, 0.4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      <Box
        position={[0.3, 0.3, 0]}
        args={[0.4, 0.6, 0.4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={teamColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* Enhanced Weapon - More Prominent */}
      <Box
        ref={weaponRef}
        position={[1.4, 1.8, 0]}
        args={[1.5, 0.4, 0.4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#333333"
          metalness={0.95}
          roughness={0.05}
          emissive="#444444"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Health Bar */}
      <Box
        position={[0, 3.5, 0]}
        args={[1.5, 0.2, 0.1]}
      >
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Health Fill */}
      <Box
        position={[0, 3.5, 0.1]}
        args={[1.5 * (player.health / player.maxHealth), 0.15, 0.05]}
      >
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.9}
        />
      </Box>

      {/* Player Name */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color={teamColor}
        anchorX="center"
        anchorY="middle"
      >
        {player.name}
      </Text>

      {/* Current Player Indicator */}
      {isCurrentPlayer && (
        <Box
          position={[0, 0.5, 0]}
          args={[1.2, 0.1, 1.2]}
        >
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.5}
          />
        </Box>
      )}

      {/* Death Effect */}
      {!isAlive && (
        <Box
          position={[0, 0.5, 0]}
          args={[1.5, 0.1, 1.5]}
        >
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.7}
          />
        </Box>
      )}
    </group>
  )
}