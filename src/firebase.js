  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/auth'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyANKD-iqQTjbTy-9WrAFiuA3dfWoYOaAzE",
    authDomain: "cliente-david.firebaseapp.com",
    projectId: "cliente-david",
    storageBucket: "cliente-david.appspot.com",
    messagingSenderId: "337191752674",
    appId: "1:337191752674:web:e2b1be1adc6c2729551fbb",
    measurementId: "G-7JTZEKNP17"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore()
  const auth = firebase.auth()

  export {db,auth, firebase}