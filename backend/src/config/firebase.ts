import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';

let firebaseApp: admin.app.App | null = null;

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

if (FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8')
    );
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize Firebase Admin');
    firebaseApp = null;
  }
} else {
  logger.warn('FIREBASE_SERVICE_ACCOUNT env var not set - push notifications disabled');
}

export { firebaseApp };
export default admin;
