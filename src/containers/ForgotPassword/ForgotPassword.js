import React, { useState } from 'react'
import { auth } from '../../firebase/config'
import Spinner from '../../components/UI/Spinner/Spinner'
import UserForgotPassword from '../../components/Auth/UserForgotPassword/UserForgotPassword'

import styles from './ForgotPassword.module.scss'


const ForgotPassword = props => {

  const [state, setState] = useState({
    email: '',
    error: '',
    isSent: false,
    isLoading: false
  })

  const handleChange = event => {

    let { name, value } = event.target

    setState({
      ...state,
      [name]: value
    })

  }

  const handleSend = () => {

    setState({
      ...state,
      isLoading: true
    })

    auth.sendPasswordResetEmail(state.email)
    .then(() => {
      setState({
        ...state,
        isSent: true,
        isLoading: false
      })
    })
    .catch((error) => {
      setState({
        ...state,
        isLoading: false,
        error: error.message
      })
    })

  }

  return(

    <div className={styles.SignUp}>

      {
        state.isLoading ?
          <Spinner /> :
          <UserForgotPassword
            state={state}
            error={state.error}
            isSent={state.isSent}
            handleSend={handleSend}
            handleChange={handleChange}
          />
      }

    </div>

  )

}

export default ForgotPassword
