import React from 'react'
import { Box, Text } from '@react-three/drei'
import { ViewerEffect } from '../../../shared/types'

interface EffectManagerProps {
  effects: ViewerEffect[]
}

export function EffectManager({ effects }: EffectManagerProps) {
  return (
    <group>
      {effects.map((effect) => (
        <group key={effect.id}>
          {/* Effect visualization based on type */}
          {effect.type === 'spawn_laser' && (
            <Box
              position={[effect.position?.x || 0, effect.position?.y || 0, effect.position?.z || 0]}
              args={[0.2, 0.2, 2]}
            >
              <meshStandardMaterial
                color="#00ff00"
                emissive="#00ff00"
                emissiveIntensity={0.8}
              />
            </Box>
          )}
          
          {effect.type === 'spawn_minion' && (
            <Box
              position={[effect.position?.x || 0, effect.position?.y || 0, effect.position?.z || 0]}
              args={[0.5, 0.5, 0.5]}
            >
              <meshStandardMaterial
                color="#ff8800"
                emissive="#ff8800"
                emissiveIntensity={0.6}
              />
            </Box>
          )}
          
          {effect.type === 'rain_coins' && (
            <Text
              position={[effect.position?.x || 0, effect.position?.y || 2, effect.position?.z || 0]}
              fontSize={0.3}
              color="#ffff00"
            >
              💰
            </Text>
          )}
        </group>
      ))}
    </group>
  )
}