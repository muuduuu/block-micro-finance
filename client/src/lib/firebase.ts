import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY3YfzpK9T8SEfuN9mfp_eBXzIAZQ6-2A",
  authDomain: "cloud-s6-b69d3.firebaseapp.com",
  projectId: "cloud-s6-b69d3",
  storageBucket: "cloud-s6-b69d3.firebasestorage.app",
  messagingSenderId: "560905508448",
  appId: "1:560905508448:web:e09a9dc7ff1643b4f89505",
  measurementId: "G-SSRERTT2FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

console.log("Using production Firebase with project:", firebaseConfig.projectId);
