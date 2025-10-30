class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()

  constructor() {
    this.initAudioContext()
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      let value = 0
      
      if (type === 'sine') {
        value = Math.sin(2 * Math.PI * frequency * t)
      } else if (type === 'square') {
        value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
      } else if (type === 'sawtooth') {
        value = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
      }
      
      // Apply envelope
      const envelope = Math.exp(-t * 3) // Simple decay
      data[i] = value * envelope * 0.1
    }

    return buffer
  }

  private loadSounds() {
    if (!this.audioContext) return

    // Create simple procedural sounds
    this.sounds.set('click', this.createTone(800, 0.1, 'square') || new AudioBuffer())
    this.sounds.set('hover', this.createTone(600, 0.05, 'sine') || new AudioBuffer())
    this.sounds.set('shoot', this.createTone(200, 0.2, 'sawtooth') || new AudioBuffer())
    this.sounds.set('impact', this.createTone(150, 0.3, 'square') || new AudioBuffer())
    this.sounds.set('explosion', this.createTone(100, 0.5, 'sawtooth') || new AudioBuffer())
  }

  playSound(id: string) {
    if (!this.audioContext) return

    const buffer = this.sounds.get(id)
    if (buffer) {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = 0.1
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } else {
      console.warn(`Sound with ID ${id} not found.`)
    }
  }

  playSpatialSound(id: string, position: { x: number, y: number, z: number }, listenerPosition: { x: number, y: number, z: number }) {
    if (!this.audioContext) return

    const buffer = this.sounds.get(id)
    if (buffer) {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      const pannerNode = this.audioContext.createPanner()
      
      source.buffer = buffer
      gainNode.gain.value = 0.1
      
      // Set up 3D positioning
      pannerNode.setPosition(position.x, position.y, position.z)
      pannerNode.panningModel = 'HRTF'
      pannerNode.distanceModel = 'exponential'
      pannerNode.rolloffFactor = 1
      pannerNode.maxDistance = 100
      
      source.connect(pannerNode)
      pannerNode.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } else {
      console.warn(`Spatial sound with ID ${id} not found.`)
    }
  }

  setVolume(id: string, volume: number) {
    // Volume is set per sound instance in playSound
    console.log(`Volume for ${id} set to ${volume}`)
  }

  setGlobalVolume(volume: number) {
    if (this.audioContext) {
      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = volume
    }
  }
}

export const soundManager = new SoundManager()