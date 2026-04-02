import express from 'express'
import rateLimit from 'express-rate-limit'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { Friendship } from '../entities/Friendship.js'
import { logger } from '../utils/logger.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { createNotification } from '../services/notificationService.js'
import { NotificationType } from '../entities/Notification.js'
import { parseId } from '../utils/validation.js'
import { isHttpError } from '../utils/errors.js'

const router = express.Router()

const userRepo = () => AppDataSource.getRepository(User)
const friendshipRepo = () => AppDataSource.getRepository(Friendship)

const handleRouteError = (res: express.Response, error: unknown) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ error: error.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

// POST /api/social/request/:userId — send friend request
router.post('/request/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const addresseeId = parseId(req.params.userId)
    const requesterId = req.user!.id

    if (requesterId === addresseeId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' })
    }

    // Check addressee exists
    const addressee = await userRepo().findOne({ where: { id: addresseeId } })
    if (!addressee) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if blocked by the other user
    const blocked = await friendshipRepo().findOne({
      where: [
        { requesterId: addresseeId, addresseeId: requesterId, status: 'BLOCKED' },
        { requesterId, addresseeId, status: 'BLOCKED' }
      ]
    })
    if (blocked) {
      return res.status(403).json({ error: 'Cannot send friend request' })
    }

    // Check if friendship already exists
    const existing = await friendshipRepo().findOne({
      where: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId }
      ]
    })

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return res.status(409).json({ error: 'Already friends' })
      }
      if (existing.status === 'PENDING') {
        return res.status(409).json({ error: 'Friend request already pending' })
      }
    }

    const friendship = friendshipRepo().create({
      requesterId,
      addresseeId,
      status: 'PENDING'
    })

    await friendshipRepo().save(friendship)

    // Send notification to addressee
    const requester = await userRepo().findOne({ where: { id: requesterId } })
    const requesterName = requester?.username || `${requester?.firstName || ''} ${requester?.lastName || ''}`.trim() || 'Someone'
    createNotification(
      addresseeId,
      NotificationType.FRIEND_REQUEST,
      'New friend request',
      `${requesterName} sent you a friend request`
    ).catch(err => logger.error({ err, route: 'social' }, 'Friend request notification failed'))

    res.status(201).json({ message: 'Friend request sent', friendship })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error sending friend request')
    handleRouteError(res, error)
  }
})

// POST /api/social/accept/:friendshipId — accept friend request
router.post('/accept/:friendshipId', authenticate, async (req: AuthRequest, res) => {
  try {
    const friendshipId = parseId(req.params.friendshipId)
    const userId = req.user!.id

    const friendship = await friendshipRepo().findOne({
      where: { id: friendshipId, addresseeId: userId, status: 'PENDING' }
    })

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' })
    }

    friendship.status = 'ACCEPTED'
    await friendshipRepo().save(friendship)

    // Notify the requester that their request was accepted
    const accepter = await userRepo().findOne({ where: { id: userId } })
    const accepterName = accepter?.username || `${accepter?.firstName || ''} ${accepter?.lastName || ''}`.trim() || 'Someone'
    createNotification(
      friendship.requesterId,
      NotificationType.FRIEND_ACCEPTED,
      'Friend request accepted',
      `${accepterName} accepted your friend request`
    ).catch(err => logger.error({ err, route: 'social' }, 'Friend accepted notification failed'))

    res.json({ message: 'Friend request accepted', friendship })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error accepting friend request')
    handleRouteError(res, error)
  }
})

// POST /api/social/reject/:friendshipId — reject/delete friend request
router.post('/reject/:friendshipId', authenticate, async (req: AuthRequest, res) => {
  try {
    const friendshipId = parseId(req.params.friendshipId)
    const userId = req.user!.id

    const friendship = await friendshipRepo().findOne({
      where: { id: friendshipId, addresseeId: userId, status: 'PENDING' }
    })

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' })
    }

    await friendshipRepo().remove(friendship)

    res.json({ message: 'Friend request rejected' })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error rejecting friend request')
    handleRouteError(res, error)
  }
})

// POST /api/social/block/:userId — block a user
router.post('/block/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const blockedUserId = parseId(req.params.userId)
    const userId = req.user!.id

    if (userId === blockedUserId) {
      return res.status(400).json({ error: 'Cannot block yourself' })
    }

    // Remove any existing friendship
    const existing = await friendshipRepo().findOne({
      where: [
        { requesterId: userId, addresseeId: blockedUserId },
        { requesterId: blockedUserId, addresseeId: userId }
      ]
    })

    if (existing) {
      await friendshipRepo().remove(existing)
    }

    // Create block record
    const block = friendshipRepo().create({
      requesterId: userId,
      addresseeId: blockedUserId,
      status: 'BLOCKED'
    })

    await friendshipRepo().save(block)

    res.json({ message: 'User blocked' })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error blocking user')
    handleRouteError(res, error)
  }
})

// DELETE /api/social/remove/:userId — remove a friend
router.delete('/remove/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const friendId = parseId(req.params.userId)
    const userId = req.user!.id

    const friendship = await friendshipRepo().findOne({
      where: [
        { requesterId: userId, addresseeId: friendId, status: 'ACCEPTED' },
        { requesterId: friendId, addresseeId: userId, status: 'ACCEPTED' }
      ]
    })

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' })
    }

    await friendshipRepo().remove(friendship)

    res.json({ message: 'Friend removed' })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error removing friend')
    handleRouteError(res, error)
  }
})

// GET /api/social/friends — list accepted friends
router.get('/friends', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const friendships = await friendshipRepo().find({
      where: [
        { requesterId: userId, status: 'ACCEPTED' },
        { addresseeId: userId, status: 'ACCEPTED' }
      ],
      relations: ['requester', 'addressee']
    })

    const friends = friendships.map(f => {
      const friend = f.requesterId === userId ? f.addressee : f.requester
      return {
        friendshipId: f.id,
        id: friend.id,
        username: friend.username,
        firstName: friend.firstName,
        lastName: friend.lastName,
        avatarUrl: friend.avatarUrl,
        bio: friend.bio
      }
    })

    res.json({ friends })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error fetching friends')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/social/requests — list pending incoming requests
router.get('/requests', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const requests = await friendshipRepo().find({
      where: { addresseeId: userId, status: 'PENDING' },
      relations: ['requester'],
      order: { createdAt: 'DESC' }
    })

    const pendingRequests = requests.map(r => ({
      friendshipId: r.id,
      id: r.requester.id,
      username: r.requester.username,
      firstName: r.requester.firstName,
      lastName: r.requester.lastName,
      avatarUrl: r.requester.avatarUrl,
      createdAt: r.createdAt
    }))

    res.json({ requests: pendingRequests })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error fetching friend requests')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Rate limiter for search endpoint
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many search requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

// GET /api/social/search?q=query — search users
router.get('/search', authenticate, searchLimiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const q = (req.query.q as string || '').trim()

    if (!q || q.length < 2) {
      return res.json({ users: [] })
    }

    // Get blocked user IDs (both directions)
    const blocks = await friendshipRepo().find({
      where: [
        { requesterId: userId, status: 'BLOCKED' },
        { addresseeId: userId, status: 'BLOCKED' }
      ]
    })
    const blockedIds = new Set(
      blocks.map(b => b.requesterId === userId ? b.addresseeId : b.requesterId)
    )

    const searchPattern = `%${q}%`

    const users = await userRepo()
      .createQueryBuilder('u')
      .select(['u.id', 'u.username', 'u.firstName', 'u.lastName', 'u.avatarUrl'])
      .where('u.id != :userId', { userId })
      .andWhere(
        '(u.username ILIKE :pattern OR u.firstName ILIKE :pattern OR u.lastName ILIKE :pattern OR CONCAT(u.firstName, \' \', u.lastName) ILIKE :pattern)',
        { pattern: searchPattern }
      )
      .take(20)
      .getMany()

    // Filter out blocked users
    const filteredUsers = users.filter(u => !blockedIds.has(u.id))

    res.json({
      users: filteredUsers.map(u => ({
        id: u.id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl
      }))
    })
  } catch (error) {
    logger.error({ err: error, route: 'social' }, 'Error searching users')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
