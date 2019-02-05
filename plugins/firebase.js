import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyBfO9z25bJGwYpWkTxzLrDrS4ILY7M4HBc',
    authDomain: 'kindnessapi.firebaseapp.com',
    databaseURL: 'https://kindnessapi.firebaseio.com',
    projectId: 'kindnessapi',
    storageBucket: 'kindnessapi.appspot.com',
    messagingSenderId: '1086411466411'
  }
  firebase.initializeApp(config)
}
const fireDb = firebase.firestore()

export {
  fireDb
}
