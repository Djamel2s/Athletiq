import express from 'express'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { Notification } from '../entities/Notification.js'

const router = express.Router()

// GET /api/notifications - List all notifications
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await AppDataSource.getRepository(Notification).find({
      where: { userId: req.user!.id },
      order: { createdAt: 'DESC' },
      take: 50
    })
    res.json(notifications)
  } catch (error) {
    console.error('Notifications fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// GET /api/notifications/unread-count
router.get('/unread-count', authenticate, async (req: AuthRequest, res) => {
  try {
    const count = await AppDataSource.getRepository(Notification).count({
      where: { userId: req.user!.id, read: false }
    })
    res.json({ count })
  } catch (error) {
    console.error('Unread count error:', error)
    res.status(500).json({ error: 'Failed to fetch unread count' })
  }
})

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(Notification)
    const notification = await repo.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!notification) return res.status(404).json({ error: 'Notification not found' })

    notification.read = true
    await repo.save(notification)
    res.json(notification)
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ error: 'Failed to mark notification as read' })
  }
})

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await AppDataSource.getRepository(Notification)
      .createQueryBuilder()
      .update()
      .set({ read: true })
      .where('userId = :userId AND read = false', { userId: req.user!.id })
      .execute()

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ error: 'Failed to mark all as read' })
  }
})

// DELETE /api/notifications/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(Notification)
    const notification = await repo.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!notification) return res.status(404).json({ error: 'Notification not found' })

    await repo.remove(notification)
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ error: 'Failed to delete notification' })
  }
})

export default router
