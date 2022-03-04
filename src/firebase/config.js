import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/analytics'

const config = {
  apiKey: process.env.REACT_APP_API_K,
  authDomain: process.env.REACT_APP_AUTH_D_ALT,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJ_ID,
  storageBucket: process.env.REACT_APP_STRG_B,
  messagingSenderId: process.env.REACT_APP_MSG_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MSGR_ID
}

export const createUserProfileDocument = async (userAuth) => {
  if (!userAuth) return

  return firestore.doc(`users/${userAuth.uid}`)
}

firebase.initializeApp(config)

export const storage = firebase.storage()
export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const db = firebase.database()
export const functions = firebase.functions()
export const analytics = firebase.analytics()

export const signOut = () => {

  firebase.auth().signOut()
  .then(() => {
    // console.log('sign out is successful')
    window.location = '/'
  })
  .catch(error => {
    // console.log('something went wrong', error)
  })

}

export default firebase
