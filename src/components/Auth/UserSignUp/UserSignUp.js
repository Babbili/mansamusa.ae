import React, { useContext, useEffect } from 'react'
import { validateEmail, validatePassword, validateRePassword } from '../utils/utils'
import { useTranslation } from 'react-i18next'
import AppContext from '../../AppContext'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
import CheckBox from '../../UI/CheckBox/CheckBox'
import Input from '../../UI/Input/Input'

import styles from './UserSignUp.module.scss'


const UserSignUp = ({ reAuth, state, signUp, isSupplier, emailError, phoneError, isError, handleChange, handleCheck, userSignUpValidation }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const fieldsValidation = state => {

    if (state.firstName.length >= 3) {
      if (state.lastName.length >= 3) {
        if (state.phone.length >= 12) {
          if (validateEmail(state.email)) {
            if (state.DOB.length >= 10) {
              if (validatePassword(state.password)) {
                return validateRePassword(state.password, state.rePassword);
              } else {
                return false
              }
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }

  }

  useEffect(() => {
    if (fieldsValidation(state) && !state.userSignUp) {
      userSignUpValidation()
    }
  }, [state, state.userSignUp, userSignUpValidation])


  return(

    <div className={styles.UserSignUp}>

      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            {reAuth !== undefined ? t('signIn.label') : t('signUp.label')}
          </div>
          {/*<div className={styles.subTitle}>*/}
          {/*  {reAuth !== undefined ? t('pleaseSignInAgain.label') : t('signupStepOne.label')}*/}
          {/*</div>*/}
        </div>

        <div
          className={styles.body}
          style={{
            pointerEvents: state.error ? 'none' : 'all'
          }}
        >

          <Input
            name={'firstName'}
            label={t('firstName.label')}
            type='text'
            value={state.firstName}
            handleChange={handleChange}
            error={isError && state.firstName.length < 3}
            text={isError && state.firstName.length < 3 ? t('enterValidFirstName.label') : ''}
            required
          />

          <Input
            name={'lastName'}
            label={t('lastName.label')}
            type='text'
            value={state.lastName}
            handleChange={handleChange}
            error={isError && state.lastName.length < 3}
            text={isError && state.lastName.length < 3 ? t('enterValidLastName.label') : ''}
            required
          />

          <PhoneInput
            jumpCursorToEnd={true}
            autoFormat={false}
            disableDropdown={true}
            inputProps={{name: 'phone'}}
            country={'ae'}
            placeholder={ t('enterYourContactNumber.label') }
            value={reAuth !== undefined && context.currentUser ? context.currentUser.phoneNumber : state.phone}
            onChange={(value, country, e, formattedValue) => {
              handleChange(e)
              context.handleSupplierAuth(country.countryCode, country.name, formattedValue)
            }}
            containerClass={styles.phoneContainer}
            buttonClass={`${styles.dropDownContainer} ${isError && state.phone.length < 12 ? styles.error : ''}`}
            inputClass={`${styles.textField} ${isError && state.phone.length < 12 ? styles.error : ''}`}
            inputStyle={{
              padding: lang !== 'en' ? '6px 45px 6px 10px' : '6px 10px 6px 45px'
            }}
          />

          {
            (isError && state.phone.length  < 12) || state.phoneError.length > 0 ?
              <div className={styles.phoneError}>
                {
                  phoneError.length > 0 ?
                    phoneError : t('enterValidPhoneNumber.label')
                }
              </div> : null
          }

          <Input
            name={'email'}
            label={t('email.label')}
            type='text'
            value={state.email}
            handleChange={handleChange}
            error={(isError && !validateEmail(state.email)) || emailError.length > 0}
            text={(isError && !validateEmail(state.email)) || emailError.length > 0 ? emailError.length > 0 ? emailError : t('enterValidEmail.label') : ''}
            required
          />

          <Input
            name={'DOB'}
            label={t('dateOfBirth.label')}
            type={'date'}
            value={state.DOB}
            handleChange={handleChange}
            error={isError && state.DOB.length < 3}
            text={isError && state.DOB.length < 3 ? t('enterValidLastName.label') : ''}
            required
          />

          <Input
            name={'password'}
            label={t('password.label')}
            type='password'
            value={state.password}
            handleChange={handleChange}
            error={isError && !validatePassword(state.password)}
            text={isError && !validatePassword(state.password) ? t('useEightSymbolError.label') : ''}
            required
          />

          <Input
            name={'rePassword'}
            label={t('confirmPassword.label')}
            type='password'
            value={state.rePassword}
            handleChange={handleChange}
            error={isError && !validateRePassword(state.password, state.rePassword)}
            text={isError && !validateRePassword(state.password, state.rePassword) ? t('passwordsDoNotMuch.label') : ''}
            required
          />

          {
            reAuth !== undefined ?
              null :
              <CheckBox
                name={'agree'}
                onClick={handleCheck}
                isChecked={state.agree}
                isSupplier={isSupplier}
                text={ t('agreeToTheTerms.label') }
                error={isError ? state.errorMessage : undefined}
              />
          }

          <SignUpButton
            title={`${reAuth !== undefined ? t('logIn.label') : t('signUp.label')}`}
            type={'custom'}
            onClick={signUp}
            disabled={false}
            isWide={true}
          />

          {
            reAuth !== undefined ?
              null :
              <div className={styles.account}>
                { t('alreadyHaveAnAccount.label') } <Link to={'/login'}> { t('logIn.label') }</Link>
              </div>
          }

        </div>

      </div>
    </div>

  )

}

export default UserSignUp
