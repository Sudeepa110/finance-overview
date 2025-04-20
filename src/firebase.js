// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfLHCdPem36vOIO5qG7i7IOe7GzDzbMcg",
    authDomain: "finance-overview-8821a.firebaseapp.com",
    projectId: "finance-overview-8821a",
    storageBucket: "finance-overview-8821a.firebasestorage.app",
    messagingSenderId: "1069942958891",
    appId: "1:1069942958891:web:52b1bd0adc41026264336e",
    measurementId: "G-GGHJS2QCBT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider(auth);

provider.setCustomParameters({
    prompt: "select_account"
});

const signInWithGooglePopup = () => signInWithPopup(auth, provider);
const db = getFirestore(app);

// const analytics = getAnalytics(app);

export { auth, signInWithGooglePopup, db };