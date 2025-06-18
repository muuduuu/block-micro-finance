// Simple Firebase connection test
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase Config:");
console.log("- API Key:", firebaseConfig.apiKey ? "✓ Present" : "✗ Missing");
console.log("- Project ID:", firebaseConfig.projectId ? "✓ Present" : "✗ Missing");
console.log("- App ID:", firebaseConfig.appId ? "✓ Present" : "✗ Missing");

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  console.log("✓ Firebase initialized successfully");
} catch (error) {
  console.error("✗ Firebase initialization failed:", error.message);
}