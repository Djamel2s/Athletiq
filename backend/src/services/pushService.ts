import admin, { firebaseApp } from '../config/firebase.js'
import { AppDataSource } from '../config/database.js'
import { FcmToken } from '../entities/FcmToken.js'
import { In } from 'typeorm'
import { logger } from '../utils/logger.js'

const fcmTokenRepo = () => AppDataSource.getRepository(FcmToken)

export async function sendPushToUser(
  userId: number,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  if (!firebaseApp) return

  try {
    const tokens = await fcmTokenRepo().find({ where: { userId } })
    if (tokens.length === 0) return

    const message: admin.messaging.MulticastMessage = {
      tokens: tokens.map(t => t.token),
      notification: { title, body },
      ...(data ? { data } : {})
    }

    const response = await admin.messaging().sendEachForMulticast(message)

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const tokensToDelete: string[] = []
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const code = resp.error?.code
          if (
            code === 'messaging/invalid-registration-token' ||
            code === 'messaging/registration-token-not-registered'
          ) {
            tokensToDelete.push(tokens[idx].token)
          }
        }
      })

      if (tokensToDelete.length > 0) {
        await fcmTokenRepo().delete({ token: In(tokensToDelete) })
        logger.info({ userId, count: tokensToDelete.length }, 'Deleted invalid FCM tokens')
      }
    }
  } catch (error) {
    logger.error({ err: error, userId }, 'Push notification error')
  }
}
