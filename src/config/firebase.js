import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCUqo5TQvjr1ESHwoiMAIU_UJQDTJyssXo",
  authDomain: "firebasics1-d22ad.firebaseapp.com",
  projectId: "firebasics1-d22ad",
  storageBucket: "firebasics1-d22ad.appspot.com",
  messagingSenderId: "347623044705",
  appId: "1:347623044705:web:38a40027446f974191dc20",
  measurementId: "G-R026X50T01"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);