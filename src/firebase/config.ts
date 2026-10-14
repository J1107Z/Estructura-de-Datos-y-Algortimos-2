import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update as rtdbUpdate,
  remove,
  get
} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDefCxUgw3L9IRsWB8xQ5HDJ5sMCgjVGDU",
  authDomain: "parcial-2-estructura.firebaseapp.com",
  projectId: "parcial-2-estructura",
  storageBucket: "parcial-2-estructura.firebasestorage.app",
  messagingSenderId: "740037598400",
  appId: "1:740037598400:web:dbfe7fc20e34a27eb42125",
  measurementId: "G-FVTZX0HRS3",
  databaseURL: "https://parcial-2-estructura-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db, ref, set, push, onValue, rtdbUpdate, remove, get };
