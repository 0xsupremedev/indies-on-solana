class MusicManager {
  private audioContext: AudioContext | null = null
  private currentTrackId: string | null = null
  private currentSource: AudioBufferSourceNode | null = null

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
      const envelope = Math.exp(-t * 0.5) // Slower decay for music
      data[i] = value * envelope * 0.05
    }

    return buffer
  }

  playTrack(id: string) {
    if (!this.audioContext) return

    if (this.currentTrackId === id) {
      return // Already playing this track
    }

    // Stop current track if any
    if (this.currentSource) {
      this.currentSource.stop()
    }

    // Create simple background music
    const buffer = this.createTone(440, 10, 'sine') // 10 second loop
    if (buffer) {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = 0.1
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.loop = true
      source.start()
      
      this.currentSource = source
      this.currentTrackId = id
    }
  }

  stopAll() {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
    this.currentTrackId = null
  }

  setVolume(id: string, volume: number) {
    console.log(`Music volume for ${id} set to ${volume}`)
  }
}

export const musicManager = new MusicManager()