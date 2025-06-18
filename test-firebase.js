// Simple Firebase connection test
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY3YfzpK9T8SEfuN9mfp_eBXzIAZQ6-2A",
  authDomain: "cloud-s6-b69d3.firebaseapp.com",
  projectId: "cloud-s6-b69d3",
  storageBucket: "cloud-s6-b69d3.firebasestorage.app",
  messagingSenderId: "560905508448",
  appId: "1:560905508448:web:e09a9dc7ff1643b4f89505",
  measurementId: "G-SSRERTT2FH"
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