import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../components/AppContext'
import { useTranslation } from 'react-i18next'
import firebase, { auth, firestore } from '../../firebase/config'
import SupplierSignUp from '../../components/Auth/SupplierSignUp/SupplierSignUp'
import UserOTP from '../../components/Auth/UserOTP/UserOTP'
import Spinner from '../../components/UI/Spinner/Spinner'
import { useLocation } from 'react-router-dom'
import UserSignUp from '../../components/Auth/UserSignUp/UserSignUp'
import moment from 'moment'

import styles from './SignUp.module.scss'
import { customerWelcomeEmail } from '../../emails/utils';


const SignUp = props => {

  const context = useContext(AppContext)
  let { t } = useTranslation()
  let location = useLocation()

  const [state, setState] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    DOB: '',
    email: '',
    password: '',
    rePassword: '',
    signUp: false,
    isError: false,
    error: '',
    code: '',
    agree: false,
    otp: false,
    verificationId: '',
    verify: false,
    errorMessage: '',
    reSend: false,
    userSignUp: false,
    phoneError: '',
    emailError: ''
  })

  const isSupplier = location.state !== undefined ? location.state.isSupplierSignUp : ''

  useEffect(() => {

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
      }
    })

  }, [])

  useEffect(() => {

    if (props.reAuth !== undefined && context.currentUser) {

      setState(prevState => {
        let temp = {...prevState}
        temp.agree = true
        temp.phone = context.currentUser.phoneNumber
        return temp
      })

    }

  }, [context, props])

  useEffect(() => {
    if (state.isError) {
      setTimeout(() => {
        setState({
          ...state,
          isError: false,
          errorMessage: '',
          phoneError: '',
          emailError: '',
          message: '',
          error: ''
        })
      }, 90000)
    }
  }, [state])

  const handleCheck = (name, value) => {
    if (!state.isError) {
      setState({
        ...state,
        [name]: value
      })
    }
  }

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const userSignUpValidation = () => {
    setState({
      ...state,
      userSignUp: true
    })
  }

  const signUp = async () => {

    if (state.agree) {

      setState({
        ...state,
        signUp: true
      })

      let appVerifier = window.recaptchaVerifier

      await firebase.auth().signInWithPhoneNumber(state.phone, appVerifier)
      .then((confirmationResult) => {

        // console.log('success', confirmationResult)

        setState({
          ...state,
          otp: true,
          verificationId: confirmationResult.verificationId
        })

        window.confirmationResult = confirmationResult

        localStorage.setItem('supplierAuth', JSON.stringify(context.supplierAuth))

      })
      .catch(function (error) {
        setState({
          ...state,
          isError: true,
          errorMessage: error.message
        })
      })

    } else {

      setState({
        ...state,
        isError: true,
        errorMessage: t('pleaseCheckThatYou.label')
      })
    }

  }

  const userSignUp = async () => {

    if (state.agree) {

      if (state.userSignUp) {

        setState({
          ...state,
          signUp: true
        })

        let appVerifier = window.recaptchaVerifier

        await auth.signInWithPhoneNumber(state.phone, appVerifier)
        .then((confirmationResult) => {

          setState({
            ...state,
            otp: true,
            verificationId: confirmationResult.verificationId
          })

          window.confirmationResult = confirmationResult

        })
        .catch(function (error) {
          setState({
            ...state,
            isError: true,
            phoneError: error.message
          })
        })

      } else {
        setState({
          ...state,
          isError: true
        })
      }

    } else {

      setState({
        ...state,
        isError: true,
        errorMessage: t('pleaseCheckThatYou.label')
      })

    }

  }

  const verifyOTP = () => {

    setState({
      ...state,
      verify: true
    })

    let credential = firebase.auth.PhoneAuthProvider
    .credential(state.verificationId, state.code)

    firebase.auth().signInWithCredential(credential)
    .then(r => {

      const uid = r.user.uid

      const usersRef = firebase.firestore()
      .collection('users').doc(uid)

      usersRef.get()
      .then((docSnapshot) => {

        if (docSnapshot.exists) {

          usersRef.onSnapshot((doc) => {
            // console.log('doc is exist', doc.data())

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

          if (isSupplier) {

            usersRef.set({
              uid: uid,
              phoneNumber: state.phone,
              email: state.email,
              displayName: `${state.firstName} ${state.lastName}`,
              completed: false,
              type: 'supplier',
              createdAt: Math.round(new Date() * 0.001)
            }).then(() => {
              props.history.push('/create-store')
            })

          } else {

            const user = auth.currentUser

            const credential = firebase.auth.EmailAuthProvider.credential(
              state.email,
              state.password
            )

            user.linkWithCredential(credential)
            .then(() => {

              firestore.collection('users').doc(uid)
              .collection('profile')
              .add({
                avatar: [],
                firstName: state.firstName,
                lastName: state.lastName,
                DOB: state.DOB,
                phoneNumber: state.phone,
                email: state.email,
                nationality: '',
                city: '',
                streetName: '',
                buildingName: '',
                floorNumber: '',
                flatNumber: '',
                location: ''
              })
              .then(() => {

                user.updateProfile({
                  displayName: `${state.firstName} ${state.lastName}`
                })
                .then(() => {

                  usersRef.set({
                    uid: uid,
                    phoneNumber: state.phone,
                    email: state.email,
                    displayName: `${state.firstName} ${state.lastName}`,
                    type: 'customer',
                    createdAt: Math.round(new Date() * 0.001)
                  })
                  .then(() => {

                    customerWelcomeEmail(state.email, state.firstName, state.lastName)
                    .then(() => {

                      props.history.push('/')

                    })

                  })

                })

              })

            })
            .catch(error => {

              console.log('error', error)

              setState({
                ...state,
                isError: true,
                error: error.message,
                verify: false,
                emailError: error.message,
                userSignUp: false,
                otp: false,
                agree: false
              })

            })

          }

        }

      })

    })
    .catch(e => {
      console.log('e', e)
      setState({
        ...state,
        isError: true,
        error: e.message
      })
    })

  }

  const reSendOTP = () => {

    setState({
      ...state,
      reSend: true
    })

    let appVerifier = window.recaptchaVerifier

    firebase.auth().signInWithPhoneNumber(state.phone, appVerifier)
    .then(r => {
      setState({
        ...state,
        reSend: false
      })
    })
    .catch(error => {
      console.log('error', error)
    })

  }

  const signInWithGoogle = () => {

    if (state.agree) {

      const googleProvider = new firebase.auth.GoogleAuthProvider()
      googleProvider.setCustomParameters({ prompt: 'select_account' })

      auth.signInWithPopup(googleProvider)
      .then((res) => {

        const uid = res.user.uid

        const usersRef = firebase.firestore()
        .collection('users').doc(uid)

        usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              console.log('doc is exist google')

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
            usersRef.set({
              uid: res.user.uid,
              email: res.user.email,
              displayName: res.user.displayName,
              photoURL: res.user.photoURL,
              completed: false,
              type: 'supplier',
              createdAt: Math.round(new Date() * 0.001)
            }).then(() => {
              props.history.push('/create-store')
            })
          }
        })

      })
      .catch((error) => {
        console.log(error.message)
      })

    } else {

      setState({
        ...state,
        error: true,
        errorMessage: t('pleaseCheckThatYou.label')
      })

    }

  }

  const one = !state.signUp && !state.otp
  const two = state.signUp && !state.otp
  const three = !state.signUp && state.otp && !state.verify
  const four = state.otp && state.verify


  return(

    <div className={styles.SignUp}>

      {
        one ?
          isSupplier || props.reAuth !== undefined ?
          <SupplierSignUp
            {...props}
            state={state}
            signUp={signUp}
            reAuth={props.reAuth}
            isSupplier={isSupplier}
            handleCheck={handleCheck}
            handleChange={handleChange}
            signInWithGoogle={signInWithGoogle}
          /> :
            <UserSignUp
              {...props}
              state={state}
              signUp={userSignUp}
              reAuth={props.reAuth}
              isError={state.isError}
              isSupplier={isSupplier}
              handleCheck={handleCheck}
              handleChange={handleChange}
              phoneError={state.phoneError}
              emailError={state.emailError}
              signInWithGoogle={signInWithGoogle}
              userSignUpValidation={userSignUpValidation}
            />:
          two ?
            <Spinner /> :
            three ?
              <UserOTP
                state={state}
                reSendOTP={reSendOTP}
                verifyOTP={verifyOTP}
                reAuth={props.reAuth}
                handleChange={handleChange}
              /> :
              four ?
                <Spinner /> :
                null
      }

      <input id="recaptcha-container" type="button" style={{display: 'none'}} />

    </div>

  )

}

export default SignUp
