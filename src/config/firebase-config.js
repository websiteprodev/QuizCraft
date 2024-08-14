
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_kPnOX_kPgx1vE24O4-wHD6p5-BvFLPA",
  authDomain: "quizcraftvps.firebaseapp.com",
  projectId: "quizcraftvps",
  storageBucket: "quizcraftvps.appspot.com",
  messagingSenderId: "147367393909",
  appId: "1:147367393909:web:43fb07b226dfc165a9163c",
  databaseURL: "https://quizcraftvps-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);