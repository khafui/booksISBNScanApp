import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBookbsEaJOakFin8kOgZsEGb1V_XuIpiE',
  authDomain: 'my-book-tracker-fcf91.firebaseapp.com',
  projectId: 'my-book-tracker-fcf91',
  storageBucket: 'my-book-tracker-fcf91.appspot.com',
  messagingSenderId: '721894023968',
  appId: '1:721894023968:web:3c49f9f590964b17f26d45',
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);