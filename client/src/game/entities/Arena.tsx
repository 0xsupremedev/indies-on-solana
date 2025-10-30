import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Plane, Text } from '@react-three/drei'
import { Mesh } from 'three'

export function Arena() {
  const arenaRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (arenaRef.current) {
      // Subtle rotation for visual interest
      arenaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group>
      {/* Main Arena Platform with Glowing Grid */}
      <Box
        ref={arenaRef}
        position={[0, 0, 0]}
        args={[20, 1, 20]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          emissive="#001122"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Enhanced Glowing Grid Floor */}
      <Plane
        position={[0, 0.01, 0]}
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.4}
          wireframe={true}
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </Plane>

      {/* Arena Border Walls */}
      <Box position={[0, 2, 10]} args={[22, 4, 1]} receiveShadow castShadow>
        <meshStandardMaterial color="#16213e" metalness={0.6} roughness={0.3} />
      </Box>
      <Box position={[0, 2, -10]} args={[22, 4, 1]} receiveShadow castShadow>
        <meshStandardMaterial color="#16213e" metalness={0.6} roughness={0.3} />
      </Box>
      <Box position={[10, 2, 0]} args={[1, 4, 20]} receiveShadow castShadow>
        <meshStandardMaterial color="#16213e" metalness={0.6} roughness={0.3} />
      </Box>
      <Box position={[-10, 2, 0]} args={[1, 4, 20]} receiveShadow castShadow>
        <meshStandardMaterial color="#16213e" metalness={0.6} roughness={0.3} />
      </Box>

      {/* Enhanced Team Zones with Larger Coverage */}
      <Box position={[-8, 0.1, 0]} args={[6, 0.1, 10]} receiveShadow>
        <meshStandardMaterial 
          color="#0088ff" 
          transparent 
          opacity={0.5}
          emissive="#0088ff"
          emissiveIntensity={0.3}
        />
      </Box>
      <Box position={[8, 0.1, 0]} args={[6, 0.1, 10]} receiveShadow>
        <meshStandardMaterial 
          color="#ff4444" 
          transparent 
          opacity={0.5}
          emissive="#ff4444"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Central Objective Structure - Red Base with Blue Stacked Blocks */}
      <Box position={[0, 1, 0]} args={[3, 1, 3]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#ff0000" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ff0000"
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Blue Block 1 */}
      <Box position={[0, 2, 0]} args={[2, 1, 2]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#0088ff" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#0088ff"
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Blue Block 2 */}
      <Box position={[0, 3, 0]} args={[1, 1, 1]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#0088ff" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#0088ff"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Enhanced Decorative Elements with Glow */}
      <Box position={[-6, 0.5, -6]} args={[1, 1, 1]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
        />
      </Box>
      <Box position={[6, 0.5, 6]} args={[1, 1, 1]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
        />
      </Box>
      <Box position={[-6, 0.5, 6]} args={[1, 1, 1]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
        />
      </Box>
      <Box position={[6, 0.5, -6]} args={[1, 1, 1]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Enhanced Team Labels with Glow - Larger and More Prominent */}
      <Text
        position={[-8, 0.2, 0]}
        fontSize={3}
        color="#0088ff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="#000000"
        font="/fonts/helvetiker_bold.typeface.json"
      >
        BLUE TEAM
      </Text>
      <Text
        position={[8, 0.2, 0]}
        fontSize={3}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="#000000"
        font="/fonts/helvetiker_bold.typeface.json"
      >
        RED TEAM
      </Text>
    </group>
  )
}
