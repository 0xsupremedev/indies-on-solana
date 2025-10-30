import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export function MainMenuBackground() {
  const groupRef = useRef<THREE.Group>(null)
  const arenaRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
    
    if (arenaRef.current) {
      arenaRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Ambient Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Floating Arena */}
      <mesh ref={arenaRef} position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.5, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          emissive="#00ffff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Arena Border */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[8.5, 2, 0.2]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.6}
          roughness={0.3}
          emissive="#0088ff"
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.2, 2, 8.5]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.6}
          roughness={0.3}
          emissive="#0088ff"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Floating Elements */}
      {Array.from({ length: 6 }, (_, i) => (
        <Sphere
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 15
          ]}
          args={[0.2 + Math.random() * 0.3]}
        >
          <meshStandardMaterial
            color={i % 2 === 0 ? "#00ffff" : "#ff4444"}
            emissive={i % 2 === 0 ? "#00ffff" : "#ff4444"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </Sphere>
      ))}

      {/* Particle Field */}
      {Array.from({ length: 50 }, (_, i) => (
        <Box
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 10,
            (Math.random() - 0.5) * 30
          ]}
          args={[0.05, 0.05, 0.05]}
        >
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </Box>
      ))}
    </group>
  )
}
