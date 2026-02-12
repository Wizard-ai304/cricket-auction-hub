import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcigewkY0R9BwP2Y7BlCOZ9V-IzKAATvo",
  authDomain: "cricket-auction-ab76c.firebaseapp.com",
  projectId: "cricket-auction-ab76c",
  storageBucket: "cricket-auction-ab76c.firebasestorage.app",
  messagingSenderId: "1068841111305",
  appId: "1:1068841111305:web:d676a2dfceb001e056cdd8",
  measurementId: "G-ZPHT3HCYDS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
