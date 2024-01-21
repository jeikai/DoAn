import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, get, set } from 'firebase/database';

const firebaseConfig = {
  // apiKey: "AIzaSyBq0UYeKIxPHXwSG0BvtmdWYX0Lur2wPr8",
  // authDomain: "graduation-c8769.firebaseapp.com",
  // projectId: "graduation-c8769",
  // storageBucket: "graduation-c8769.appspot.com",
  // messagingSenderId: "207177752785",
  // appId: "1:207177752785:web:edbf99d74a165b0a93a5f0",
  // measurementId: "G-275C94T96D"

  apiKey: 'AIzaSyC7GBqxUxvLEwH7Q-lgDeG2JHszTxJ2fuM',
  authDomain: 'baitaplon-92053.firebaseapp.com',
  databaseURL: 'https://baitaplon-92053-default-rtdb.firebaseio.com',
  projectId: 'baitaplon-92053',
  storageBucket: 'baitaplon-92053.appspot.com',
  messagingSenderId: '46014821785',
  appId: '1:46014821785:web:1e90d66ca6e65674a88f08',
  measurementId: 'G-X95NQRSFSN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onValue, get, set };
