import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { Arena } from '../entities/Arena'
import { Player } from '../entities/Player'
import { ProjectileManager } from '../entities/ProjectileManager'
import { EffectManager } from '../entities/EffectManager'
import { PostProcessing } from '../effects/PostProcessing'
import { EnvironmentalEffects, DynamicLighting } from '../effects/EnvironmentalEffects'
import { MuzzleFlash, ImpactSparks, Explosion } from '../effects/ParticleSystem'
import { soundManager } from '../../audio/SoundManager'
import { useGameStore } from '../../stores/gameStore'
import { useSocketStore } from '../../stores/socketStore'
import { Vector3 } from 'three'

export function GameScene() {
  const { camera, gl } = useThree()
  const { gameState, currentPlayer } = useGameStore()
  const { socket } = useSocketStore()

  console.log('GameScene rendering', { gameState, currentPlayer })
  const controlsRef = useRef<any>()
  const [effects, setEffects] = React.useState<Array<{ type: string, position: [number, number, number], id: string }>>([])

  // Handle WebGL context lost
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      console.warn('WebGL context lost, attempting to restore...')
    }

    const handleContextRestored = () => {
      console.log('WebGL context restored')
      // Force re-render
      gl.forceContextRestore()
    }

    gl.domElement.addEventListener('webglcontextlost', handleContextLost)
    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored)

    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost)
      gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [gl])

  // Set up camera controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableDamping = true
      controlsRef.current.dampingFactor = 0.05
      controlsRef.current.enableZoom = true
      controlsRef.current.enablePan = false
      controlsRef.current.minDistance = 5
      controlsRef.current.maxDistance = 50
      controlsRef.current.maxPolarAngle = Math.PI / 2
    }
  }, [])

  // Handle player movement
  useEffect(() => {
    if (!socket || !currentPlayer) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const moveSpeed = 0.2
      const newPosition = { ...currentPlayer.position }

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          newPosition.z -= moveSpeed
          break
        case 'KeyS':
        case 'ArrowDown':
          newPosition.z += moveSpeed
          break
        case 'KeyA':
        case 'ArrowLeft':
          newPosition.x -= moveSpeed
          break
        case 'KeyD':
        case 'ArrowRight':
          newPosition.x += moveSpeed
          break
      }

      // Send movement to server
      socket.emit('playerMove', newPosition, currentPlayer.rotation)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!currentPlayer) return

      // Calculate rotation based on mouse position
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const deltaX = event.clientX - centerX
      const deltaY = event.clientY - centerY

      const rotation = {
        x: currentPlayer.rotation.x,
        y: currentPlayer.rotation.y + deltaX * 0.001,
        z: currentPlayer.rotation.z
      }

      socket.emit('playerMove', currentPlayer.position, rotation)
    }

    const handleClick = (event: MouseEvent) => {
      if (!currentPlayer || event.button !== 0) return

      // Calculate shoot direction
      const direction = new THREE.Vector3(0, 0, -1)
      direction.applyEuler(new THREE.Euler(currentPlayer.rotation.x, currentPlayer.rotation.y, currentPlayer.rotation.z))

      // Add muzzle flash effect
      const muzzlePosition: [number, number, number] = [
        currentPlayer.position.x + 0.8,
        currentPlayer.position.y + 1.8,
        currentPlayer.position.z
      ]
      setEffects(prev => [...prev, { type: 'muzzle', position: muzzlePosition, id: Date.now().toString() }])

      // Play shoot sound
      soundManager.playSpatialSound('shoot', muzzlePosition, {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      })

      socket.emit('playerShoot', { x: direction.x, y: direction.y, z: direction.z }, 'bullet')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [socket, currentPlayer])

  // Update camera to follow current player with better positioning
  useFrame(() => {
    if (currentPlayer && camera) {
      const targetPosition = new THREE.Vector3(
        currentPlayer.position.x,
        currentPlayer.position.y + 12,
        currentPlayer.position.z + 15
      )
      
      camera.position.lerp(targetPosition, 0.1)
      camera.lookAt(currentPlayer.position.x, currentPlayer.position.y + 2, currentPlayer.position.z)
    }
  })

  if (!gameState) {
    return null
  }

  return (
    <>
      {/* Test Cube to verify Canvas is working */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <DynamicLighting intensity={1.2} />
      
      {/* Enhanced Lens Flare Effects */}
      <pointLight
        position={[0, 20, 0]}
        intensity={3}
        color="#00ffff"
        distance={60}
      />
      <pointLight
        position={[15, 15, 15]}
        intensity={2}
        color="#ff4444"
        distance={40}
      />
      <pointLight
        position={[-15, 15, -15]}
        intensity={2}
        color="#0088ff"
        distance={40}
      />
      <pointLight
        position={[0, 25, 0]}
        intensity={1.5}
        color="#ffffff"
        distance={80}
      />
      
      {/* Environment */}
      <EnvironmentalEffects enableFog={true} enableAtmosphere={true} />
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      
      {/* Arena */}
      <Arena />
      
      {/* Players */}
      {Array.from(gameState.players.values()).map((player) => (
        <Player
          key={player.id}
          player={player}
          isCurrentPlayer={currentPlayer?.id === player.id}
        />
      ))}
      
      {/* Projectiles */}
      <ProjectileManager projectiles={Array.from(gameState.projectiles.values())} />
      
      {/* Viewer Effects */}
      <EffectManager effects={Array.from(gameState.effects.values())} />
      
      {/* Particle Effects */}
      {effects.map((effect) => {
        switch (effect.type) {
          case 'muzzle':
            return <MuzzleFlash key={effect.id} position={effect.position} />
          case 'impact':
            return <ImpactSparks key={effect.id} position={effect.position} />
          case 'explosion':
            return <Explosion key={effect.id} position={effect.position} />
          default:
            return null
        }
      })}
      
      {/* Post Processing */}
      <PostProcessing 
        enableBloom={true}
        enableVignette={true}
        enableChromaticAberration={false}
        enableNoise={false}
      />
      
      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        target={currentPlayer ? [currentPlayer.position.x, currentPlayer.position.y, currentPlayer.position.z] : [0, 0, 0]}
      />
    </>
  )
}
