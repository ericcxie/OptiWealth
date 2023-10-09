// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCoO2nTl1clc693WFnTv0m5xtGeqYVQsBA",
//   authDomain: "optiwealth-73eaa.firebaseapp.com",
//   projectId: "optiwealth-73eaa",
//   storageBucket: "optiwealth-73eaa.appspot.com",
//   messagingSenderId: "820943711917",
//   appId: "1:820943711917:web:bdbc4a6d5332655d156024",
//   measurementId: "G-960WQBE10B",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

setPersistence(auth, browserLocalPersistence);
