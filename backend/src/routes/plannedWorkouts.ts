import express from 'express'
import { MoreThanOrEqual, In } from 'typeorm'
import { AppDataSource } from '../config/database.js'
import { PlannedWorkout } from '../entities/PlannedWorkout.js'
import { Friendship } from '../entities/Friendship.js'
import { User } from '../entities/User.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { createNotification } from '../services/notificationService.js'
import { NotificationType } from '../entities/Notification.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()

const plannedWorkoutRepo = () => AppDataSource.getRepository(PlannedWorkout)
const friendshipRepo = () => AppDataSource.getRepository(Friendship)
const userRepo = () => AppDataSource.getRepository(User)

/**
 * Check if two users are friends (ACCEPTED friendship).
 */
async function areFriends(userA: number, userB: number): Promise<boolean> {
  const friendship = await friendshipRepo().findOne({
    where: [
      { requesterId: userA, addresseeId: userB, status: 'ACCEPTED' },
      { requesterId: userB, addresseeId: userA, status: 'ACCEPTED' }
    ]
  })
  return !!friendship
}

/**
 * Get display name for a user.
 */
function displayName(user: User): string {
  return user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Quelqu\'un'
}

// POST / — create a planned workout invitation
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const inviterId = req.user!.id
    const { inviteeId, name, scheduledAt, workoutTemplateId, notes } = req.body

    if (!inviteeId || !name || !scheduledAt) {
      return res.status(400).json({ error: 'inviteeId, name and scheduledAt are required' })
    }

    const parsedInviteeId = typeof inviteeId === 'string' ? parseId(inviteeId) : inviteeId

    if (inviterId === parsedInviteeId) {
      return res.status(400).json({ error: 'Cannot invite yourself' })
    }

    // Verify invitee exists
    const invitee = await userRepo().findOne({ where: { id: parsedInviteeId } })
    if (!invitee) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify they are friends
    if (!(await areFriends(inviterId, parsedInviteeId))) {
      return res.status(403).json({ error: 'You can only invite friends' })
    }

    const scheduledDate = new Date(scheduledAt)
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ error: 'Invalid scheduledAt date' })
    }

    const planned = plannedWorkoutRepo().create({
      inviterId,
      inviteeId: parsedInviteeId,
      name: String(name).slice(0, 200),
      scheduledAt: scheduledDate,
      workoutTemplateId: workoutTemplateId ? Number(workoutTemplateId) : undefined,
      notes: notes ? String(notes).slice(0, 500) : undefined,
      status: 'PENDING'
    })

    const saved = await plannedWorkoutRepo().save(planned)

    // Send notification to invitee
    const inviter = await userRepo().findOne({ where: { id: inviterId } })
    const inviterName = inviter ? displayName(inviter) : 'Quelqu\'un'
    const dateStr = scheduledDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    createNotification(
      parsedInviteeId,
      NotificationType.WORKOUT_INVITATION,
      'Invitation workout',
      `${inviterName} te propose : ${name} le ${dateStr}`
    ).catch(err => console.error('Planned workout notification failed:', err))

    res.status(201).json(saved)
  } catch (error) {
    console.error('Error creating planned workout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /:id/accept — accept invitation
router.post('/:id/accept', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id)
    const userId = req.user!.id

    const planned = await plannedWorkoutRepo().findOne({
      where: { id, inviteeId: userId, status: 'PENDING' }
    })

    if (!planned) {
      return res.status(404).json({ error: 'Planned workout not found or already responded' })
    }

    planned.status = 'ACCEPTED'
    await plannedWorkoutRepo().save(planned)

    // Notify the inviter
    const accepter = await userRepo().findOne({ where: { id: userId } })
    const accepterName = accepter ? displayName(accepter) : 'Quelqu\'un'
    createNotification(
      planned.inviterId,
      NotificationType.WORKOUT_INVITATION_ACCEPTED,
      'Invitation acceptee',
      `${accepterName} a accepte ${planned.name}`
    ).catch(err => console.error('Accept notification failed:', err))

    res.json({ message: 'Invitation accepted', planned })
  } catch (error) {
    console.error('Error accepting planned workout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /:id/decline — decline invitation
router.post('/:id/decline', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id)
    const userId = req.user!.id

    const planned = await plannedWorkoutRepo().findOne({
      where: { id, inviteeId: userId, status: 'PENDING' }
    })

    if (!planned) {
      return res.status(404).json({ error: 'Planned workout not found or already responded' })
    }

    planned.status = 'DECLINED'
    await plannedWorkoutRepo().save(planned)

    res.json({ message: 'Invitation declined' })
  } catch (error) {
    console.error('Error declining planned workout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET / — list upcoming planned workouts
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const planned = await plannedWorkoutRepo().find({
      where: [
        { inviterId: userId, scheduledAt: MoreThanOrEqual(new Date()), status: In(['PENDING', 'ACCEPTED']) },
        { inviteeId: userId, scheduledAt: MoreThanOrEqual(new Date()), status: In(['PENDING', 'ACCEPTED']) }
      ],
      relations: ['inviter', 'invitee'],
      order: { scheduledAt: 'ASC' }
    })

    const result = planned.map(p => ({
      id: p.id,
      name: p.name,
      scheduledAt: p.scheduledAt,
      status: p.status,
      notes: p.notes,
      workoutTemplateId: p.workoutTemplateId,
      inviterId: p.inviterId,
      inviteeId: p.inviteeId,
      createdAt: p.createdAt,
      inviter: {
        id: p.inviter.id,
        username: p.inviter.username,
        firstName: p.inviter.firstName,
        lastName: p.inviter.lastName,
        avatarUrl: p.inviter.avatarUrl
      },
      invitee: {
        id: p.invitee.id,
        username: p.invitee.username,
        firstName: p.invitee.firstName,
        lastName: p.invitee.lastName,
        avatarUrl: p.invitee.avatarUrl
      }
    }))

    res.json({ plannedWorkouts: result })
  } catch (error) {
    console.error('Error fetching planned workouts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /:id — cancel a planned workout (inviter only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseId(req.params.id)
    const userId = req.user!.id

    const planned = await plannedWorkoutRepo().findOne({
      where: { id, inviterId: userId }
    })

    if (!planned) {
      return res.status(404).json({ error: 'Planned workout not found' })
    }

    await plannedWorkoutRepo().remove(planned)

    res.json({ message: 'Planned workout cancelled' })
  } catch (error) {
    console.error('Error cancelling planned workout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
