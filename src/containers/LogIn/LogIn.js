import React, { useEffect, useState } from 'react'
import firebase, { auth } from '../../firebase/config'
import UserLogIn from '../../components/Auth/UserLogIn/UserLogIn'
import Spinner from '../../components/UI/Spinner/Spinner'
import UserOTP from '../../components/Auth/UserOTP/UserOTP'

import styles from './LogIn.module.scss'


const LogIn = props => {

  const [state, setState] = useState({
    email: '',
    phone: '',
    password: '',
    code: '',
    otp: false,
    verificationId: '',
    verifyOTP: false,
    errorCode: '',
    error: '',
    isError: false,
    isLogin: false
  })

  useEffect(() => {
    if (state.isError) {
      setTimeout(() => {
        setState({
          ...state,
          errorCode: '',
          error: '',
          isError: false
        })
      }, 3000)
    }
  })

  useEffect(() => {

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
      }
    })

  }, [])

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const handleSubmit = async () => {

    setState({
      ...state,
      isLogin: true
    })

    if (state.phone.length > 5) {

      let appVerifier = window.recaptchaVerifier

      await auth.signInWithPhoneNumber(state.phone, appVerifier)
      .then((confirmationResult) => {

        // console.log('success', confirmationResult)

        setState({
          ...state,
          otp: true,
          verificationId: confirmationResult.verificationId
        })

        window.confirmationResult = confirmationResult

      })
      .catch(function (error) {
        // console.log('auth error', error)
        setState({
          ...state,
          errorCode: error.code,
          error: error.message,
          isError: true,
          isLogin: false
        })
      })

    } else {

      await auth.signInWithEmailAndPassword(state.email, state.password)
      .then((r) => {

        const usersRef = firebase.firestore()
        .collection('users').doc(r.user.uid)

        usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {

              setState({
                ...state,
                isLogin: false
              })

              if (doc.data().type === 'supplier') {
                if (doc.data().completed === false) {
                  props.history.push('/create-store')
                } else {
                  props.history.push('/supplier')
                }
              } else {
                props.history.push('/')
              }

            })
          } else {
            // console.log('no user')
          }
        })

      })
      .catch(error => {
        setState({
          ...state,
          errorCode: error.code,
          error: error.message,
          isError: true,
          isLogin: false
        })
      })

    }

  }

  const verifyOTP = () => {

    setState({
      ...state,
      verifyOTP: true
    })

    let credential = firebase.auth.PhoneAuthProvider
    .credential(state.verificationId, state.code)

    auth.signInWithCredential(credential)
    .then(r => {

      const usersRef = firebase.firestore()
      .collection('users').doc(r.user.uid)

      usersRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          usersRef.onSnapshot((doc) => {

            if (doc.data().type === 'supplier') {
              if (doc.data().completed === false) {
                props.history.push('/create-store')
              } else {
                props.history.push('/supplier')
              }
            } else {
              props.history.push('/')
            }

          })
        } else {
          setState({
            ...state,
            errorCode: 'nouser',
            error: 'User does not exist. Sign Up first before Login.',
            isError: true,
            verifyOTP: false,
            isLogin: false,
            otp: false
          })
        }
      })

    })
    .catch(e => {
      setState({
        ...state,
        errorCode: '',
        error: e.message,
        isError: true,
        verifyOTP: false
      })
    })
  }

  const signInWithGoogle = () => {

    const googleProvider = new firebase.auth.GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: 'select_account' })

    auth.signInWithPopup(googleProvider)
    .then((res) => {
      props.history.push('/supplier/profile')
    })
    .catch((error) => {
      console.log(error.message)
    })

  }


  return(

    <div className={styles.SignUp}>

      {
        state.isLogin || state.verifyOTP ?
          <Spinner /> :
          state.otp ?
            <UserOTP
              state={state}
              verifyOTP={verifyOTP}
              handleChange={handleChange}
            /> :
            <UserLogIn
              state={state}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              signInWithGoogle={signInWithGoogle}
            />
      }

      <input id="recaptcha-container" type="button" style={{display: 'none'}} />

    </div>

  )

}

export default LogIn
