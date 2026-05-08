import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlePgbuas2B3D7Wc6tDvpk3o8PHBainxU",
  authDomain: "journeyfoods-io-stg.firebaseapp.com",
  databaseURL: "https://journeyfoods-io-stg.firebaseio.com",
  projectId: "journeyfoods-io-stg",
  storageBucket: "journeyfoods-io-stg.appspot.com",
  messagingSenderId: "783640165713",
  appId: "1:783640165713:web:b80ab0166cdcccff86e770",
  measurementId: "G-9P75PEJ48P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
