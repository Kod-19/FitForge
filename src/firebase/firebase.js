import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_APP_ID || "",
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || undefined,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value === undefined || value === null || value.length > 0,
);

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export let analytics = null;

if (app) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
} else {
  console.warn(
    "Firebase is not configured. Add your VITE_* values to a .env file to enable authentication and Firestore.",
  );
}

export { logEvent };
