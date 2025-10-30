import React, { useRef } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

interface PostProcessingProps {
  intensity?: number
  enableBloom?: boolean
  enableVignette?: boolean
  enableChromaticAberration?: boolean
  enableNoise?: boolean
}

export function PostProcessing({
  intensity = 1,
  enableBloom = true,
  enableVignette = true,
  enableChromaticAberration = false,
  enableNoise = false
}: PostProcessingProps) {
  const bloomRef = useRef<any>()

  return (
    <EffectComposer>
      {enableBloom && (
        <Bloom
          ref={bloomRef}
          intensity={intensity * 0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.8}
        />
      )}
      
      {enableVignette && (
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      
      {enableChromaticAberration && (
        <ChromaticAberration
          offset={[0.001, 0.001]}
          radialModulation={true}
          modulationOffset={0.15}
        />
      )}
      
      {enableNoise && (
        <Noise
          premultiply
          blendFunction={BlendFunction.MULTIPLY}
        />
      )}
    </EffectComposer>
  )
}

// Screen shake effect
export function ScreenShake({ intensity = 1, duration = 0.5 }: { intensity?: number, duration?: number }) {
  const shakeRef = useRef<any>()
  
  React.useEffect(() => {
    if (shakeRef.current) {
      shakeRef.current.intensity = intensity
      setTimeout(() => {
        if (shakeRef.current) {
          shakeRef.current.intensity = 0
        }
      }, duration * 1000)
    }
  }, [intensity, duration])

  return (
    <EffectComposer>
      <ChromaticAberration
        ref={shakeRef}
        offset={[intensity * 0.01, intensity * 0.01]}
        radialModulation={false}
      />
    </EffectComposer>
  )
}
