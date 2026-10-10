import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => Boolean(value));

// Notifications are an optional enhancement. Do not initialize Firebase at module
// load time when the app is running without FCM environment variables, and do not
// let unsupported browsers crash the entire feedback form.
const app = hasFirebaseConfig
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

const messaging: Messaging | null = app && typeof window !== 'undefined'
  ? (() => {
      try {
        return getMessaging(app);
      } catch {
        return null;
      }
    })()
  : null;

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging || !('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
}

export function onMessageListener(callback: (payload: { notification?: { title?: string; body?: string }; data?: Record<string, string> }) => void) {
  if (!messaging) return () => undefined;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}

export { messaging };
