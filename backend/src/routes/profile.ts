import express from 'express'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { Workout } from '../entities/Workout.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { logger } from '../utils/logger.js'
import { Friendship } from '../entities/Friendship.js'
import { FeedPost } from '../entities/FeedPost.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { IsNull, Not } from 'typeorm'

const router = express.Router()

const userRepo = () => AppDataSource.getRepository(User)
const workoutRepo = () => AppDataSource.getRepository(Workout)
const photoRepo = () => AppDataSource.getRepository(WorkoutPhoto)
const friendshipRepo = () => AppDataSource.getRepository(Friendship)

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

// Optional auth middleware — tries to authenticate but doesn't fail if no token
const optionalAuth = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      await authenticate(req, res, () => {})
    }
  } catch {
    // Ignore auth errors — user just won't be authenticated
  }
  next()
}

// Check if viewer is a friend of the target user
async function isFriend(viewerId: number, targetId: number): Promise<boolean> {
  const friendship = await friendshipRepo().findOne({
    where: [
      { requesterId: viewerId, addresseeId: targetId, status: 'ACCEPTED' },
      { requesterId: targetId, addresseeId: viewerId, status: 'ACCEPTED' }
    ]
  })
  return !!friendship
}

// GET /api/profile/me — get own profile data (authenticated)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepo().findOne({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      isPublic: user.isPublic !== false,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl
    })
  } catch (error) {
    logger.error({ err: error, route: 'profile' }, 'Error fetching own profile')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/profile/check-username/:username — check if username is available
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params
    if (!USERNAME_REGEX.test(username)) {
      return res.json({ available: false, reason: 'Username must be 3-20 characters, lowercase alphanumeric and underscores only' })
    }
    const existing = await userRepo().findOne({ where: { username } })
    res.json({ available: !existing })
  } catch (error) {
    logger.error({ err: error, route: 'profile' }, 'Error checking username')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/profile — update own profile
router.put('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { username, bio, isPublic } = req.body

    const user = await userRepo().findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (username !== undefined) {
      if (username !== null && !USERNAME_REGEX.test(username)) {
        return res.status(400).json({ error: 'Username must be 3-20 characters, lowercase alphanumeric and underscores only' })
      }
      if (username !== null) {
        const existing = await userRepo().findOne({ where: { username } })
        if (existing && existing.id !== userId) {
          return res.status(409).json({ error: 'Username already taken' })
        }
      }
      user.username = username
    }

    if (bio !== undefined) {
      user.bio = bio
    }

    if (isPublic !== undefined) {
      user.isPublic = isPublic
    }

    await userRepo().save(user)

    res.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      isPublic: user.isPublic !== false,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl
    })
  } catch (error) {
    logger.error({ err: error, route: 'profile' }, 'Error updating profile')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/profile/:username — public profile
router.get('/:username', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { username } = req.params

    const user = await userRepo().findOne({ where: { username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const viewerId = req.user?.id
    const isOwnProfile = viewerId === user.id
    const isFriendOfUser = viewerId && !isOwnProfile ? await isFriend(viewerId, user.id) : false

    // If profile is private and viewer is not a friend and not own profile
    const isPublicProfile = user.isPublic !== false  // null or true = public
    if (!isPublicProfile && !isOwnProfile && !isFriendOfUser) {
      return res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isPublic: false,
        restricted: true
      })
    }

    // Calculate stats
    const workoutCount = await workoutRepo().count({
      where: { userId: user.id, completedAt: Not(IsNull()) }
    })

    const volumeResult = await workoutRepo()
      .createQueryBuilder('w')
      .select('COALESCE(SUM(w.totalVolume), 0)', 'totalVolume')
      .where('w.userId = :userId', { userId: user.id })
      .andWhere('w.completedAt IS NOT NULL')
      .getRawOne()

    const totalVolume = Number(volumeResult?.totalVolume) || 0

    // Simple streak calculation: count consecutive days with completed workouts
    const recentWorkouts = await workoutRepo().find({
      where: { userId: user.id, completedAt: Not(IsNull()) },
      order: { completedAt: 'DESC' },
      select: ['completedAt'],
      take: 200
    })

    let streak = 0
    if (recentWorkouts.length > 0) {
      const workoutDates = new Set(
        recentWorkouts.map(w => {
          const d = new Date(w.completedAt!)
          d.setHours(0, 0, 0, 0)
          return d.getTime()
        })
      )
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const today = now.getTime()
      const yesterday = today - 24 * 60 * 60 * 1000

      if (workoutDates.has(today) || workoutDates.has(yesterday)) {
        let checkDate = workoutDates.has(today) ? today : yesterday
        while (workoutDates.has(checkDate)) {
          streak++
          checkDate -= 24 * 60 * 60 * 1000
        }
      }
    }

    // Recent photos
    const recentPhotos = await photoRepo()
      .createQueryBuilder('p')
      .innerJoin('p.workout', 'w')
      .where('w.userId = :userId', { userId: user.id })
      .orderBy('p.createdAt', 'DESC')
      .take(6)
      .getMany()

    // Check friendship status for viewer
    let requestPending = false
    if (viewerId && !isOwnProfile) {
      const pendingRequest = await AppDataSource.getRepository(Friendship).findOne({
        where: [
          { requesterId: viewerId, addresseeId: user.id, status: 'PENDING' },
          { requesterId: user.id, addresseeId: viewerId, status: 'PENDING' }
        ]
      })
      requestPending = !!pendingRequest
    }

    // Load user's feed posts
    const feedPosts = await AppDataSource.getRepository(FeedPost).find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      take: 20
    })

    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isPublic: user.isPublic !== false,
      memberSince: user.createdAt,
      restricted: false,
      isFriend: !!isFriendOfUser,
      requestPending,
      stats: {
        workoutCount,
        totalVolume,
        streak
      },
      recentPhotos: recentPhotos.map(p => ({ id: p.id, photoUrl: p.photoUrl, createdAt: p.createdAt })),
      posts: feedPosts
    })
  } catch (error) {
    logger.error({ err: error, route: 'profile' }, 'Error fetching profile')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/profile/:username/photos — get user's training photos
router.get('/:username/photos', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { username } = req.params
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 20, 1), 50)
    const offset = Math.max(parseInt(req.query.offset as string, 10) || 0, 0)

    const user = await userRepo().findOne({ where: { username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const viewerId = req.user?.id
    const isOwnProfile = viewerId === user.id
    const isFriendOfUser = viewerId && !isOwnProfile ? await isFriend(viewerId, user.id) : false

    if (!user.isPublic && !isOwnProfile && !isFriendOfUser) {
      return res.status(403).json({ error: 'This profile is private' })
    }

    const [photos, total] = await photoRepo()
      .createQueryBuilder('p')
      .innerJoin('p.workout', 'w')
      .where('w.userId = :userId', { userId: user.id })
      .orderBy('p.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount()

    res.json({
      photos: photos.map(p => ({ id: p.id, photoUrl: p.photoUrl, createdAt: p.createdAt })),
      total,
      limit,
      offset
    })
  } catch (error) {
    logger.error({ err: error, route: 'profile' }, 'Error fetching photos')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
