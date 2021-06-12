import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {

    // apiKey: "AIzaSyCzKJyVrD_OQpCXMu2VmPfBfH1dXfBT0WE",
    // authDomain: "wily-app-d3077.firebaseapp.com",
    // projectId: "wily-app-d3077",
    // storageBucket: "wily-app-d3077.appspot.com",
    // messagingSenderId: "505818570986",
    // appId: "1:505818570986:web:0bc7f52e85e5df8621b793"
  apiKey: "AIzaSyAw7bUER-Tv_3w--OUOmh8v1iaVN5KqOIM",
  authDomain: "wily-app-844af.firebaseapp.com",
  projectId: "wily-app-844af",
  storageBucket: "wily-app-844af.appspot.com",
  messagingSenderId: "641211381349",
  appId: "1:641211381349:web:c83dedf8e71c76ef2ff88c",
  measurementId: "G-EG2Y7NHMZD"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();

  export default db;    