import express from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { AppDataSource } from '../config/database.js'
import { WorkoutSession } from '../entities/WorkoutSession.js'
import { User } from '../entities/User.js'
import { Friendship } from '../entities/Friendship.js'
import { Workout } from '../entities/Workout.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()

const sessionRepo = () => AppDataSource.getRepository(WorkoutSession)
const userRepo = () => AppDataSource.getRepository(User)
const friendshipRepo = () => AppDataSource.getRepository(Friendship)
const workoutRepo = () => AppDataSource.getRepository(Workout)

// Generate a 6-char uppercase alphanumeric code (easy to read/type)
function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I to avoid confusion
  const bytes = crypto.randomBytes(6)
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

// Check if two users are friends (accepted friendship)
async function areFriends(userId1: number, userId2: number): Promise<boolean> {
  const friendship = await friendshipRepo().findOne({
    where: [
      { requesterId: userId1, addresseeId: userId2, status: 'ACCEPTED' },
      { requesterId: userId2, addresseeId: userId1, status: 'ACCEPTED' }
    ]
  })
  return !!friendship
}

// POST /api/sessions — Create a new session
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const user = await userRepo().findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Generate unique session code
    let sessionCode: string
    let attempts = 0
    do {
      sessionCode = generateSessionCode()
      const existing = await sessionRepo().findOne({ where: { sessionCode } })
      if (!existing) break
      attempts++
    } while (attempts < 10)

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Could not generate unique session code' })
    }

    const session = sessionRepo().create({
      hostId: userId,
      sessionCode,
      status: 'WAITING',
      participants: [{
        userId: user.id,
        username: user.username || '',
        firstName: user.firstName || '',
        avatarUrl: user.avatarUrl || undefined,
        currentExerciseIndex: 0,
        currentSetNumber: 1,
        totalExercises: 0,
        restTimeRemaining: 0,
        restDuration: 0,
        isFinished: false
      }],
      currentTurnIndex: 0,
      mode: 'TURN_BASED'
    })

    await sessionRepo().save(session)

    res.status(201).json({ session })
  } catch (error) {
    console.error('Error creating session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:code/join — Join a session (remote, from another phone)
router.post('/:code/join', authenticate, async (req: AuthRequest, res) => {
  try {
    const { code } = req.params
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { sessionCode: code.toUpperCase() } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.status !== 'WAITING' && session.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Session is not accepting participants' })
    }

    // Check if already in session
    if (session.participants.some(p => p.userId === userId)) {
      return res.status(409).json({ error: 'Already in this session' })
    }

    // Verify friendship with host
    const friends = await areFriends(userId, session.hostId)
    if (!friends) {
      return res.status(403).json({ error: 'You must be friends with the host to join' })
    }

    const user = await userRepo().findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    session.participants.push({
      userId: user.id,
      username: user.username || '',
      firstName: user.firstName || '',
      avatarUrl: user.avatarUrl || undefined,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      totalExercises: 0,
      restTimeRemaining: 0,
      restDuration: 0,
      isFinished: false
    })

    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error joining session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:code/join-local — Join on same phone (mode 1)
router.post('/:code/join-local', authenticate, async (req: AuthRequest, res) => {
  try {
    const { code } = req.params
    const { email, password } = req.body
    const hostUserId = req.user!.id

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const session = await sessionRepo().findOne({ where: { sessionCode: code.toUpperCase() } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.hostId !== hostUserId) {
      return res.status(403).json({ error: 'Only the host can add local participants' })
    }

    if (session.status !== 'WAITING' && session.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Session is not accepting participants' })
    }

    // Authenticate the guest user
    const guest = await userRepo().findOne({ where: { email: email.toLowerCase().trim() } })
    if (!guest) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, guest.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check if already in session
    if (session.participants.some(p => p.userId === guest.id)) {
      return res.status(409).json({ error: 'User already in this session' })
    }

    // Verify friendship with host
    const friends = await areFriends(guest.id, session.hostId)
    if (!friends) {
      return res.status(403).json({ error: 'Guest must be friends with the host to join' })
    }

    session.participants.push({
      userId: guest.id,
      username: guest.username || '',
      firstName: guest.firstName || '',
      avatarUrl: guest.avatarUrl || undefined,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      totalExercises: 0,
      restTimeRemaining: 0,
      restDuration: 0,
      isFinished: false
    })

    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error joining session locally:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/start — Start the session (host only)
router.post('/:id/start', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ error: 'Only the host can start the session' })
    }

    if (session.status !== 'WAITING') {
      return res.status(400).json({ error: 'Session cannot be started from current state' })
    }

    session.status = 'ACTIVE'
    session.currentTurnIndex = 0

    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error starting session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/pause — Pause (host only)
router.post('/:id/pause', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ error: 'Only the host can pause the session' })
    }

    if (session.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Session is not active' })
    }

    session.status = 'PAUSED'
    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error pausing session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/resume — Resume (host only)
router.post('/:id/resume', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ error: 'Only the host can resume the session' })
    }

    if (session.status !== 'PAUSED') {
      return res.status(400).json({ error: 'Session is not paused' })
    }

    session.status = 'ACTIVE'
    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error resuming session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/leave — Leave session
router.post('/:id/leave', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const participantIndex = session.participants.findIndex(p => p.userId === userId)
    if (participantIndex === -1) {
      return res.status(400).json({ error: 'You are not in this session' })
    }

    // Remove participant
    session.participants.splice(participantIndex, 1)

    if (session.participants.length === 0) {
      // No participants left, end session
      session.status = 'COMPLETED'
    } else if (session.hostId === userId) {
      // Transfer host to the next participant
      session.hostId = session.participants[0].userId
    }

    // Adjust currentTurnIndex if needed
    if (session.currentTurnIndex >= session.participants.length && session.participants.length > 0) {
      session.currentTurnIndex = 0
    }

    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error leaving session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/end — End session (host only)
router.post('/:id/end', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    if (session.hostId !== userId) {
      return res.status(403).json({ error: 'Only the host can end the session' })
    }

    session.status = 'COMPLETED'
    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error ending session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/sessions/:code — Get session by code
router.get('/:code', authenticate, async (req: AuthRequest, res) => {
  try {
    const { code } = req.params
    const session = await sessionRepo().findOne({ where: { sessionCode: code.toUpperCase() } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json({ session })
  } catch (error) {
    console.error('Error getting session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sessions/:id/set-workout — Set which workout a participant will do
router.post('/:id/set-workout', authenticate, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseId(req.params.id)
    const userId = req.user!.id
    const { workoutId } = req.body

    if (!workoutId) {
      return res.status(400).json({ error: 'workoutId is required' })
    }

    const session = await sessionRepo().findOne({ where: { id: sessionId } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const participantIndex = session.participants.findIndex(p => p.userId === userId)
    if (participantIndex === -1) {
      return res.status(403).json({ error: 'You are not in this session' })
    }

    // Get the workout to verify it exists and get its name
    const workout = await workoutRepo().findOne({
      where: { id: parseId(String(workoutId)) },
      relations: ['exercises']
    })
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    session.participants[participantIndex].workoutId = workout.id
    session.participants[participantIndex].workoutName = workout.name
    session.participants[participantIndex].totalExercises = workout.exercises?.length || 0

    await sessionRepo().save(session)

    res.json({ session })
  } catch (error) {
    console.error('Error setting workout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
