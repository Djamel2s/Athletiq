import { Server as SocketServer } from 'socket.io'
import type { Server as HttpServer } from 'http'
import jwt from 'jsonwebtoken'

const sessionRooms = new Map<string, Set<string>>() // sessionCode -> Set of socketIds

export function setupWebSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true
    }
  })

  // Auth middleware - verify JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication required'))
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
      socket.data.userId = payload.userId
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`WS connected: user ${socket.data.userId}`)

    // Join a session room
    socket.on('session:join', (sessionCode: string) => {
      socket.join(`session:${sessionCode}`)
      if (!sessionRooms.has(sessionCode)) sessionRooms.set(sessionCode, new Set())
      sessionRooms.get(sessionCode)!.add(socket.id)
    })

    // Set validated - participant finished their set
    socket.on('session:set-validated', (data: {
      sessionCode: string
      userId: number
      exerciseIndex: number
      setNumber: number
      reps: number
      weight: number
      restDuration: number
    }) => {
      // Broadcast to all in session
      io.to(`session:${data.sessionCode}`).emit('session:set-validated', data)
    })

    // Turn change - move to next participant
    socket.on('session:turn-change', (data: {
      sessionCode: string
      nextTurnIndex: number
      nextUserId: number
    }) => {
      io.to(`session:${data.sessionCode}`).emit('session:turn-change', data)
    })

    // Timer update - sync rest timers
    socket.on('session:timer-update', (data: {
      sessionCode: string
      userId: number
      restTimeRemaining: number
    }) => {
      socket.to(`session:${data.sessionCode}`).emit('session:timer-update', data)
    })

    // Pause/resume
    socket.on('session:pause', (sessionCode: string) => {
      io.to(`session:${sessionCode}`).emit('session:paused')
    })

    socket.on('session:resume', (sessionCode: string) => {
      io.to(`session:${sessionCode}`).emit('session:resumed')
    })

    // Participant finished their workout
    socket.on('session:participant-finished', (data: {
      sessionCode: string
      userId: number
    }) => {
      io.to(`session:${data.sessionCode}`).emit('session:participant-finished', data)
    })

    // Session ended
    socket.on('session:end', (sessionCode: string) => {
      io.to(`session:${sessionCode}`).emit('session:ended')
    })

    // Photo taken
    socket.on('session:photo-ready', (data: {
      sessionCode: string
      userId: number
    }) => {
      io.to(`session:${data.sessionCode}`).emit('session:photo-ready', data)
    })

    // Disconnect
    socket.on('disconnect', () => {
      // Remove from all session rooms
      for (const [code, sockets] of sessionRooms) {
        sockets.delete(socket.id)
        if (sockets.size === 0) sessionRooms.delete(code)
        else {
          io.to(`session:${code}`).emit('session:participant-disconnected', {
            userId: socket.data.userId
          })
        }
      }
    })
  })

  return io
}
