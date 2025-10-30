import React from 'react'
import { Box } from '@react-three/drei'
import { Projectile } from '../../../shared/types'

interface ProjectileManagerProps {
  projectiles: Projectile[]
}

export function ProjectileManager({ projectiles }: ProjectileManagerProps) {
  return (
    <group>
      {projectiles.map((projectile) => (
        <Box
          key={projectile.id}
          position={[projectile.position.x, projectile.position.y, projectile.position.z]}
          args={[0.1, 0.1, 0.1]}
          castShadow
        >
          <meshStandardMaterial
            color={projectile.type === 'laser' ? '#00ff00' : projectile.type === 'rocket' ? '#ff4444' : '#ffff00'}
            emissive={projectile.type === 'laser' ? '#00ff00' : projectile.type === 'rocket' ? '#ff4444' : '#ffff00'}
            emissiveIntensity={0.5}
          />
        </Box>
      ))}
    </group>
  )
}