import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqCck5j9nwjWUgFeNmRrjjLdgvFm9wtzY",
  authDomain: "viralpotai.firebaseapp.com",
  projectId: "viralpotai",
  storageBucket: "viralpotai.firebasestorage.app",
  messagingSenderId: "5486021100",
  appId: "1:5486021100:web:3641076ac78455ab3758c9",
  measurementId: "G-JBE63TJ4CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
