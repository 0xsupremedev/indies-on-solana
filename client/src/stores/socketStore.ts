import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from '../../../shared/types'

interface SocketStore {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
  connectionError: string | null
  
  // Actions
  connect: (serverUrl: string) => void
  disconnect: () => void
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  connectionError: null,

  connect: (serverUrl) => {
    const { socket } = get()
    
    if (socket) {
      socket.disconnect()
    }

    const newSocket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      set({ isConnected: true, connectionError: null })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      set({ isConnected: false })
    })

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      set({ connectionError: error.message, isConnected: false })
    })

    set({ socket: newSocket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  setConnected: (connected) => set({ isConnected: connected }),
  
  setError: (error) => set({ connectionError: error })
}))
