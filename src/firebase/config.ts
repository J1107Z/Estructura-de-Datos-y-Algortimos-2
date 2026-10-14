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
  apiKey: "AIzaSyDQVzLxx2QF_IL-6zrGCzuTI8qUmKGKxEI",
  authDomain: "challenge-09-f2f67.firebaseapp.com",
  projectId: "challenge-09-f2f67",
  storageBucket: "challenge-09-f2f67.firebasestorage.app",
  messagingSenderId: "596312592471",
  appId: "1:596312592471:web:df426ab5f8d6e63291d312",
  measurementId: "G-EWD4M6NLHF",
  databaseURL: "https://challenge-09-f2f67-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db, ref, set, push, onValue, rtdbUpdate, remove, get };
