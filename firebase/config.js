import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import '@firebase/auth';
import '@firebase/firestore';


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;