// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, serverTimestamp , query} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC8D5fd0i2Nt79GThet2MDcyCX6KozuMRo",
  authDomain: "giphyproject-432c1.firebaseapp.com",
  projectId: "giphyproject-432c1",
  storageBucket: "giphyproject-432c1.appspot.com",
  messagingSenderId: "372910803831",
  appId: "1:372910803831:web:d30dfcd4070b8ed976ef72",
  measurementId: "G-FPDF4RWE38"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db,query};