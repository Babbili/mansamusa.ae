import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase/config'
import queryString from 'query-string'
import Spinner from '../../components/UI/Spinner/Spinner'
import UserResetPassword from '../../components/Auth/UserResetPassword/UserResetPassword'

import styles from './Action.module.scss'
import UserConfirmEmail from "../../components/Auth/UserConfirmEmail/UserConfirmEmail";


const Action = props => {

  const [state, setState] = useState({
    password: '',
    error: '',
    isDone: false,
    isLoading: false
  })

  useEffect(() => {
    const parsed = queryString.parse(props.location.search)
    if (parsed) {
      setState(prevState => {
        return {
          ...prevState,
          ...parsed
        }
      })
    }
  }, [props.location.search])

  useEffect(() => {

    if (state.error.length > 0) {
      setTimeout(() => {
        setState(prevState => {
          return {
            ...prevState,
            error: ''
          }
        })
      }, 2000)
    }

  }, [state.error])

  const handleChange = event => {
    let { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const handleReset = () => {

    setState({
      ...state,
      isLoading: true
    })

    auth.confirmPasswordReset(state.oobCode, state.password)
    .then(r => {
      setState({
        ...state,
        isDone: true,
        isLoading: false
      })
    })
    .catch(error => {
      console.log('e', error)
      setState({
        ...state,
        isLoading: false,
        error: error.message
      })
    })

  }

  const handleVerifyEmail = () => {

    setState({
      ...state,
      isLoading: true
    })

    auth.applyActionCode(state.oobCode)
    .then(resp => {
      console.log('resp', resp)
      setState({
        ...state,
        isDone: true,
        isLoading: false
      })
      setTimeout(() => {
        props.history.push('/')
      }, 1500)
    })
    .catch(error => {
      console.log('error', error)
      setState({
        ...state,
        isLoading: false,
        error: error.message
      })
    })

  }

  console.log('state', state)

  return(

    <div className={styles.Action}>

      {
        state.isLoading ?
          <Spinner /> :
          state.mode === 'resetPassword' ?
            <UserResetPassword
              state={state}
              error={state.error}
              history={props.history}
              isDone={state.isDone}
              handleReset={handleReset}
              handleChange={handleChange}
              {...props}
            /> :
            <UserConfirmEmail
              state={state}
              error={state.error}
              isDone={state.isDone}
              handleClick={handleVerifyEmail}
              {...props}
            />
      }

    </div>

  )

}

export default Action
