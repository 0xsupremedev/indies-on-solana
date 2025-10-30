import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Fog, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface EnvironmentalEffectsProps {
  fogColor?: string
  fogNear?: number
  fogFar?: number
  enableFog?: boolean
  enableAtmosphere?: boolean
}

export function EnvironmentalEffects({
  fogColor = '#1a1a2e',
  fogNear = 10,
  fogFar = 50,
  enableFog = true,
  enableAtmosphere = true
}: EnvironmentalEffectsProps) {
  const { scene } = useThree()

  useMemo(() => {
    if (enableFog) {
      scene.fog = new THREE.Fog(fogColor, fogNear, fogFar)
    } else {
      scene.fog = null
    }
  }, [scene, fogColor, fogNear, fogFar, enableFog])

  return (
    <>
      {enableAtmosphere && (
        <Environment preset="night" />
      )}
    </>
  )
}

// Dynamic lighting based on viewer effects
export function DynamicLighting({ intensity = 1 }: { intensity?: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      // Subtle pulsing based on intensity
      lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Color shifting based on time
      const hue = (state.clock.elapsedTime * 0.1) % 1
      lightRef.current.color.setHSL(hue, 0.3, 0.8)
    }
  })

  return (
    <directionalLight
      ref={lightRef}
      position={[10, 20, 10]}
      intensity={intensity}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-far={50}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
    />
  )
}

// Laser beam glow effect
export function LaserGlow({ position, direction, length = 10 }: {
  position: [number, number, number]
  direction: [number, number, number]
  length?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.1
      meshRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3
    }
  })

  const endPosition = [
    position[0] + direction[0] * length,
    position[1] + direction[1] * length,
    position[2] + direction[2] * length
  ] as [number, number, number]

  return (
    <group>
      {/* Main beam */}
      <mesh position={position} ref={meshRef}>
        <cylinderGeometry args={[0.1, 0.1, length, 8]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.8}
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={position}>
        <cylinderGeometry args={[0.3, 0.3, length, 8]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.2}
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Impact point */}
      <mesh position={endPosition}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.6}
          emissive="#ff0000"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

// Holographic UI elements in 3D space
export function HolographicUI({ position, text, color = '#00ffff' }: {
  position: [number, number, number]
  text: string
  color?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Background panel */}
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Border */}
      <mesh>
        <planeGeometry args={[4.1, 1.1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>
    </group>
  )
}

// Weather effects
export function WeatherEffect({ type = 'rain', intensity = 1 }: {
  type?: 'rain' | 'snow' | 'fog'
  intensity?: number
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = Math.floor(1000 * intensity)

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 50 + 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    
    return positions
  }, [particleCount])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      if (type === 'rain') {
        positions[i3 + 1] -= 20 * delta * intensity // Fall down
        if (positions[i3 + 1] < -25) {
          positions[i3 + 1] = 25
        }
      } else if (type === 'snow') {
        positions[i3 + 1] -= 5 * delta * intensity // Fall slowly
        positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.5 * delta
        if (positions[i3 + 1] < -25) {
          positions[i3 + 1] = 25
        }
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  const color = type === 'rain' ? '#0088ff' : type === 'snow' ? '#ffffff' : '#cccccc'
  const size = type === 'rain' ? 0.1 : type === 'snow' ? 0.05 : 0.2

  return (
    <Points ref={particlesRef} positions={positions}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  )
}
