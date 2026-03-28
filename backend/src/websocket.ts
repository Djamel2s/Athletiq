import { Server as SocketServer } from 'socket.io'
import type { Server as HttpServer } from 'http'
import jwt from 'jsonwebtoken'

const sessionRooms = new Map<string, Set<string>>() // sessionCode -> Set of socketIds
const sessionParticipants = new Map<string, Set<number>>() // sessionCode -> Set of userIds

// Rate limiter per socket (#4)
const socketRateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(socketId: string, maxPerSecond: number = 10): boolean {
  const now = Date.now()
  const limit = socketRateLimits.get(socketId)
  if (!limit || now > limit.resetAt) {
    socketRateLimits.set(socketId, { count: 1, resetAt: now + 1000 })
    return true
  }
  limit.count++
  if (limit.count > maxPerSecond) return false
  return true
}

// Input validation helpers (#3)
function isValidSessionCode(code: unknown): code is string {
  return typeof code === 'string' && /^[A-Z0-9]{6}$/.test(code)
}

function isValidNumber(val: unknown, min: number, max: number): val is number {
  return typeof val === 'number' && Number.isFinite(val) && val >= min && val <= max
}

function extractSessionCode(data: any): string | null {
  // Accept either sessionCode (correct) or sessionId (legacy) — but only valid codes
  const code = data?.sessionCode ?? data?.sessionId
  if (isValidSessionCode(code)) return code
  // If it's a string that uppercases to a valid code, accept it
  if (typeof code === 'string' && isValidSessionCode(code.toUpperCase())) return code.toUpperCase()
  return null
}

export function setupWebSocket(httpServer: HttpServer) {
  const isProduction = process.env.NODE_ENV === 'production'
  const io = new SocketServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowed = process.env.CORS_ORIGIN
        if (!origin || (allowed && origin === allowed)) {
          callback(null, true)
        } else if (!allowed && !isProduction && origin?.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
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
    // Join a session room
    socket.on('session:join', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      // Accept both { sessionCode: "ABC123" } and plain string "ABC123"
      const sessionCode = typeof data === 'string'
        ? (isValidSessionCode(data.toUpperCase()) ? data.toUpperCase() : null)
        : extractSessionCode(data)

      if (!sessionCode) return

      socket.join(`session:${sessionCode}`)
      if (!sessionRooms.has(sessionCode)) sessionRooms.set(sessionCode, new Set())
      sessionRooms.get(sessionCode)!.add(socket.id)

      // Track participant membership (#2)
      if (!sessionParticipants.has(sessionCode)) sessionParticipants.set(sessionCode, new Set())
      sessionParticipants.get(sessionCode)!.add(socket.data.userId)

      // Store the sessionCode on socket for later checks
      if (!socket.data.sessionCodes) socket.data.sessionCodes = new Set<string>()
      socket.data.sessionCodes.add(sessionCode)
    })

    // Set validated - participant finished their set
    socket.on('session:set-validated', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      if (!isValidNumber(data.reps, 0, 10000)) return
      if (!isValidNumber(data.weight, 0, 10000)) return

      // Force userId to prevent spoofing (#3)
      const safeData = {
        sessionCode,
        userId: socket.data.userId,
        exerciseIndex: isValidNumber(data.exerciseIndex, 0, 1000) ? data.exerciseIndex : 0,
        setNumber: isValidNumber(data.setNumber, 0, 1000) ? data.setNumber : 1,
        reps: data.reps,
        weight: data.weight,
        restDuration: isValidNumber(data.restDuration, 0, 600) ? data.restDuration : 90
      }

      io.to(`session:${sessionCode}`).emit('session:set-validated', safeData)
    })

    // Turn change - move to next participant
    socket.on('session:turn-change', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      const nextTurnIndex = data.nextTurnIndex ?? data.turnIndex
      if (!isValidNumber(nextTurnIndex, 0, 100)) return

      const safeData = {
        sessionCode,
        nextTurnIndex,
        turnIndex: nextTurnIndex,
        nextUserId: isValidNumber(data.nextUserId ?? data.turnUserId, 0, Number.MAX_SAFE_INTEGER)
          ? (data.nextUserId ?? data.turnUserId) : undefined
      }

      io.to(`session:${sessionCode}`).emit('session:turn-change', safeData)
    })

    // Timer update - sync rest timers
    socket.on('session:timer-update', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      const restRemaining = data.restTimeRemaining ?? data.restRemaining
      if (!isValidNumber(restRemaining, 0, 600)) return

      const safeData = {
        sessionCode,
        userId: socket.data.userId,
        restTimeRemaining: restRemaining,
        restRemaining
      }

      socket.to(`session:${sessionCode}`).emit('session:timer-update', safeData)
    })

    // Pause/resume
    socket.on('session:pause', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = typeof data === 'string'
        ? (isValidSessionCode(data.toUpperCase()) ? data.toUpperCase() : null)
        : extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      io.to(`session:${sessionCode}`).emit('session:paused')
    })

    socket.on('session:resume', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = typeof data === 'string'
        ? (isValidSessionCode(data.toUpperCase()) ? data.toUpperCase() : null)
        : extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      io.to(`session:${sessionCode}`).emit('session:resumed')
    })

    // Participant finished their workout
    socket.on('session:participant-finished', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      const safeData = {
        sessionCode,
        userId: socket.data.userId
      }

      io.to(`session:${sessionCode}`).emit('session:participant-finished', safeData)
    })

    // Session ended
    socket.on('session:end', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = typeof data === 'string'
        ? (isValidSessionCode(data.toUpperCase()) ? data.toUpperCase() : null)
        : extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      io.to(`session:${sessionCode}`).emit('session:ended')
    })

    // Photo taken
    socket.on('session:photo-ready', (data: any) => {
      if (!checkRateLimit(socket.id)) { socket.disconnect(true); return }

      const sessionCode = extractSessionCode(data)
      if (!sessionCode) return
      if (!sessionParticipants.get(sessionCode)?.has(socket.data.userId)) return

      const safeData = {
        sessionCode,
        userId: socket.data.userId
      }

      io.to(`session:${sessionCode}`).emit('session:photo-ready', safeData)
    })

    // Disconnect
    socket.on('disconnect', () => {
      // Clean up rate limit entry
      socketRateLimits.delete(socket.id)

      // Remove from all session rooms and participant tracking
      const codes = socket.data.sessionCodes || []
      for (const code of codes) {
        // Remove socket from room
        const sockets = sessionRooms.get(code)
        if (sockets) {
          sockets.delete(socket.id)
          if (sockets.size === 0) {
            sessionRooms.delete(code)
            sessionParticipants.delete(code)
          } else {
            // Remove from participant tracking
            sessionParticipants.get(code)?.delete(socket.data.userId)
            io.to(`session:${code}`).emit('session:participant-disconnected', {
              userId: socket.data.userId
            })
          }
        }
      }
    })
  })

  return io
}
