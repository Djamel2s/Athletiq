import express from 'express'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { Notification } from '../entities/Notification.js'
import { parseId } from '../utils/validation.js'
import { logger } from '../utils/logger.js'

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
    logger.error({ err: error, route: 'notifications' }, 'Notifications fetch error')
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' })
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
    logger.error({ err: error, route: 'notifications' }, 'Unread count error')
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de non lus' })
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

    res.json({ message: 'Toutes les notifications marquées comme lues' })
  } catch (error) {
    logger.error({ err: error, route: 'notifications' }, 'Mark all read error')
    res.status(500).json({ error: 'Erreur lors du marquage des notifications' })
  }
})

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(Notification)
    const notification = await repo.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!notification) return res.status(404).json({ error: 'Notification non trouvée' })

    notification.read = true
    await repo.save(notification)
    res.json(notification)
  } catch (error) {
    logger.error({ err: error, route: 'notifications' }, 'Mark read error')
    res.status(500).json({ error: 'Erreur lors du marquage de la notification' })
  }
})

// DELETE /api/notifications/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(Notification)
    const notification = await repo.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!notification) return res.status(404).json({ error: 'Notification non trouvée' })

    await repo.remove(notification)
    res.json({ message: 'Notification supprimée' })
  } catch (error) {
    logger.error({ err: error, route: 'notifications' }, 'Delete notification error')
    res.status(500).json({ error: 'Erreur lors de la suppression de la notification' })
  }
})

export default router
