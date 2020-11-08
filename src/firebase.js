import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAWtZFS3miA_A9wK3pBkveWQv_1Aw4MVnM",
    authDomain: "instagram-forme.firebaseapp.com",
    databaseURL: "https://instagram-forme.firebaseio.com",
    projectId: "instagram-forme",
    storageBucket: "instagram-forme.appspot.com",
    messagingSenderId: "170190945923",
    appId: "1:170190945923:web:460f90c988704dcf9be5b6",
    measurementId: "G-6Z40TJFCMF"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};