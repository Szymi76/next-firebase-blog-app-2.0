// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCav_y5iiLt6qmqVNDcDS-nyiOSpfaEZxk",
  authDomain: "sandbox-6669b.firebaseapp.com",
  projectId: "sandbox-6669b",
  storageBucket: "sandbox-6669b.appspot.com",
  messagingSenderId: "81864343709",
  appId: "1:81864343709:web:f1a8cbe18314b04a141474",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };
