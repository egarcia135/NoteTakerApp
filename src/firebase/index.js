import firebase, { firestore } from 'firebase/app';
import 'firebase/storage';


var config = {
    apiKey: "AIzaSyAj5XPvp5Y9dxLFYUo1gOCX8pNBpPaTY8g",
    authDomain: "notes-292cf.firebaseapp.com",
    databaseURL: "https://notes-292cf.firebaseio.com",
    projectId: "notes-292cf",
    storageBucket: "notes-292cf.appspot.com",
    messagingSenderId: "727479889594"
  };
  firebase.initializeApp(config);

  const storage = firebase.storage();

  export {
      storage, firebase as default
  }