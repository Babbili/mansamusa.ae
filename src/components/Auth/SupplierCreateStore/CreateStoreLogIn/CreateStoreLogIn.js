import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../UI/Input/Input'
import { validateEmail, validatePassword, validateRePassword, validateName } from '../../utils/utils'
import {firestore} from "../../../../firebase/config";


const CreateStoreLogIn = ({ index, state, currentUser, newStore, handleChange, handleStepValidation }) => {

  const currentIndex = 0
  let { t } = useTranslation()
  const [isValidEmail, setIsValidEmail] = useState(true)

  useEffect(() => {

    if (newStore) {

      if (
        validateEmail(state.email) && validateName(state.firstName) &&
        validateName(state.lastName) &&
        isValidEmail
      ) {
        if (index === currentIndex) {
          handleStepValidation(currentIndex, true)
        }
      } else {
        if (index === currentIndex) {
          handleStepValidation(currentIndex, false)
        }
      }

    } else {

      if (
        validateEmail(state.email) && validateName(state.firstName) &&
        validateName(state.lastName) && validatePassword(state.password) &&
        validateRePassword(state.password, state.rePassword) &&
        isValidEmail
      ) {
        if (index === currentIndex) {
          handleStepValidation(currentIndex, true)
        }
      } else {
        if (index === currentIndex) {
          handleStepValidation(currentIndex, false)
        }
      }

    }

  }, [newStore, isValidEmail, state, index, handleStepValidation])

  // if email exists
  useEffect(() => {

    if (validateEmail(state.email)) {

      firestore.collection('users')
      .where('type', '==', 'supplier')
      .where('uid', '!=', currentUser.uid)
      .onSnapshot(snapshot => {

        snapshot.forEach(doc => {

          if (doc.data().email === state.email) {

            setIsValidEmail(false)

          }

        })

      })

    } else {

      setIsValidEmail(true)

    }

  }, [state.email])


  return(

    <div className='row' style={{display: currentIndex === index ? 'flex' : 'none'}}>

      <div className='col-12'>
        <Input
          name='email'
          type='text'
          label={ t('email.label') }
          value={state.email}
          handleChange={handleChange}
          error={(!validateEmail(state.email) && state.email.length > 0) || !isValidEmail}
          text={
            !validateEmail(state.email) && state.email.length > 0 ?
              t('enterValidEmail.label') :
              !isValidEmail ?
                'Email is already in use by another supplier.' :
                'This email will be using as login and as a store contact email.'
          }
          required
        />
      </div>

      <div className='col-6'>
        <Input
          name='firstName'
          type='text'
          label={ t('firstName.label') }
          value={state.firstName}
          handleChange={handleChange}
          error={!validateName(state.firstName) && state.firstName.length > 0}
          text={!validateName(state.firstName) && state.firstName.length > 0 ? t('enterValidFirstName.label') : ''}
        />
      </div>

      <div className='col-6'>
        <Input
          name='lastName'
          type='text'
          label={ t('lastName.label') }
          value={state.lastName}
          handleChange={handleChange}
          error={!validateName(state.lastName) && state.lastName.length > 0}
          text={!validateName(state.lastName) && state.lastName.length > 0 ? t('enterValidLastName.label') : ''}
        />
      </div>

      {
        newStore ? null :
          <>
            <div className='col-12'>
              <Input
                name='password'
                type='password'
                label={ t('password.label') }
                value={state.password}
                error={!validatePassword(state.password) && state.password.length > 0}
                text={
                  !validatePassword(state.password) && state.password.length > 0 ?
                    t('useEightSymbolError.label') :
                    !validatePassword(state.password) && state.password.length === 0 ?
                      t('useEightSymbolError.label') : ''
                }
                handleChange={handleChange}
              />
            </div>

            <div className='col-12'>
              <Input
                name='rePassword'
                type='password'
                label={ t('confirmPassword.label') }
                value={state.rePassword}
                error={!validateRePassword(state.password, state.rePassword) && state.rePassword.length > 0}
                text={
                  !validateRePassword(state.password, state.rePassword) && state.rePassword.length > 0 ?
                    t('passwordsDoNotMuch.label') : ''
                }
                handleChange={handleChange}
              />
            </div>
          </>
      }

    </div>

  )

}

export default CreateStoreLogIn
