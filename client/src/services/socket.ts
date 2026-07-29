import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export const connectSocket = (): Socket => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export const joinSession = (sessionId: string): void => {
  const s = getSocket()
  s.emit('join-session', sessionId)
}

export const leaveSession = (sessionId: string): void => {
  const s = getSocket()
  s.emit('leave-session', sessionId)
}

export const sendDetection = (data: any): void => {
  const s = getSocket()
  s.emit('detection-update', data)
}
