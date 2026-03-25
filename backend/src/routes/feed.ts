import express from 'express'
import { In } from 'typeorm'
import { AppDataSource } from '../config/database.js'
import { FeedPost } from '../entities/FeedPost.js'
import { Friendship } from '../entities/Friendship.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()

const feedPostRepo = () => AppDataSource.getRepository(FeedPost)
const friendshipRepo = () => AppDataSource.getRepository(Friendship)

// Helper: get accepted friend IDs for a user
async function getFriendIds(userId: number): Promise<number[]> {
  const friendships = await friendshipRepo().find({
    where: [
      { requesterId: userId, status: 'ACCEPTED' },
      { addresseeId: userId, status: 'ACCEPTED' }
    ]
  })

  return friendships.map(f =>
    f.requesterId === userId ? f.addresseeId : f.requesterId
  )
}

// GET /api/feed — get feed (posts from friends + own posts)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 20, 1), 50)
    const offset = Math.max(parseInt(req.query.offset as string, 10) || 0, 0)

    const friendIds = await getFriendIds(userId)
    const feedUserIds = [userId, ...friendIds]

    const [posts, total] = await feedPostRepo()
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.userId IN (:...userIds)', { userIds: feedUserIds })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount()

    const formattedPosts = posts.map(post => ({
      id: post.id,
      type: post.type,
      data: post.data,
      reactions: post.reactions,
      createdAt: post.createdAt,
      user: {
        id: post.user.id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.username,
        avatarUrl: post.user.avatarUrl
      }
    }))

    res.json({ posts: formattedPosts, total, limit, offset })
  } catch (error) {
    console.error('Error fetching feed:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/feed — create a manual post
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const { type, data } = req.body

    if (!type || typeof type !== 'string') {
      return res.status(400).json({ error: 'Post type is required' })
    }

    const allowedTypes = ['TEMPLATE_SHARED', 'PHOTO', 'TIMELAPSE', 'WORKOUT_COMPLETED', 'PR_ACHIEVED']
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid post type' })
    }

    const post = feedPostRepo().create({
      userId,
      type,
      data: data || null
    })

    await feedPostRepo().save(post)

    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/feed/:postId/react — toggle reaction on a post
router.post('/:postId/react', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = parseId(req.params.postId)

    const post = await feedPostRepo().findOne({ where: { id: postId } })
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Simple increment — in a production app you'd track who reacted to allow toggle
    post.reactions = (post.reactions || 0) + 1
    await feedPostRepo().save(post)

    res.json({ message: 'Reaction added', reactions: post.reactions })
  } catch (error) {
    console.error('Error reacting to post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/feed/:postId — delete own post
router.delete('/:postId', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = parseId(req.params.postId)
    const userId = req.user!.id

    const result = await feedPostRepo().delete({ id: postId, userId })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Post not found or not owned by you' })
    }

    res.json({ message: 'Post deleted' })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
