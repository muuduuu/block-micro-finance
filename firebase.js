// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);