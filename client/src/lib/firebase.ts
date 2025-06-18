import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

// Debug: Log environment variables
console.log("Firebase Environment Check:", {
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "Present" : "Missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "Missing",
  isDev: import.meta.env.DEV
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Only use emulators if no real Firebase credentials are provided
const shouldUseEmulators = import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY;
console.log("Using Firebase emulators:", shouldUseEmulators);

if (shouldUseEmulators) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Connected to Firebase emulators");
  } catch (error) {
    console.log("Emulator connection error (may already be connected):", error);
  }
} else {
  console.log("Using production Firebase with project:", firebaseConfig.projectId);
}
