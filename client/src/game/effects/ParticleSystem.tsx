import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticleSystemProps {
  position: [number, number, number]
  count?: number
  color?: string
  size?: number
  speed?: number
  lifetime?: number
  spread?: number
  onComplete?: () => void
}

export function ParticleSystem({
  position,
  count = 100,
  color = '#ffffff',
  size = 0.1,
  speed = 1,
  lifetime = 2,
  spread = 2,
  onComplete
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const startTime = useRef(Date.now())
  const isActive = useRef(true)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Random position around center
      positions[i * 3] = position[0] + (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = position[1] + (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * spread

      // Random velocity
      velocities[i * 3] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 1] = Math.random() * speed * 0.5 + speed * 0.5 // Upward bias
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed
    }

    return { positions, velocities }
  }, [position, count, speed, spread])

  useFrame((state, delta) => {
    if (!pointsRef.current || !isActive.current) return

    const elapsed = (Date.now() - startTime.current) / 1000
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    // Update particle positions
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * delta
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta

      // Apply gravity
      velocities[i * 3 + 1] -= 9.81 * delta
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Check if particles should be destroyed
    if (elapsed > lifetime) {
      isActive.current = false
      onComplete?.()
    }
  })

  if (!isActive.current) return null

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        color={color}
        size={size}
        transparent
        opacity={1 - (Date.now() - startTime.current) / (lifetime * 1000)}
        sizeAttenuation
        vertexColors={false}
      />
    </Points>
  )
}

// Specific particle effects
export function MuzzleFlash({ position }: { position: [number, number, number] }) {
  return (
    <ParticleSystem
      position={position}
      count={50}
      color="#ffff00"
      size={0.05}
      speed={3}
      lifetime={0.3}
      spread={0.5}
    />
  )
}

export function ImpactSparks({ position }: { position: [number, number, number] }) {
  return (
    <ParticleSystem
      position={position}
      count={30}
      color="#ff8800"
      size={0.03}
      speed={2}
      lifetime={0.8}
      spread={1}
    />
  )
}

export function Explosion({ position }: { position: [number, number, number] }) {
  return (
    <>
      <ParticleSystem
        position={position}
        count={100}
        color="#ff0000"
        size={0.1}
        speed={5}
        lifetime={1.5}
        spread={3}
      />
      <ParticleSystem
        position={position}
        count={50}
        color="#ffaa00"
        size={0.08}
        speed={4}
        lifetime={1.2}
        spread={2.5}
      />
    </>
  )
}

export function PowerUpCollection({ position }: { position: [number, number, number] }) {
  return (
    <ParticleSystem
      position={position}
      count={20}
      color="#00ff00"
      size={0.06}
      speed={1}
      lifetime={1}
      spread={0.8}
    />
  )
}

export function LaserTrail({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = useMemo(() => {
    const points = []
    const segments = 20
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      points.push(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t
      )
    }
    
    return new Float32Array(points)
  }, [start, end])

  return (
    <Points positions={points}>
      <PointMaterial
        color="#00ffff"
        size={0.1}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </Points>
  )
}
