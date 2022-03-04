import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
// import Separator from '../../UI/Separator/Separator'
import CheckBox from '../../UI/CheckBox/CheckBox'

import styles from './SupplierSignUp.module.scss'


const SupplierSignUp = ({ reAuth, state, signUp, isSupplier, handleChange, handleCheck, signInWithGoogle }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()


  return(

    <div className={styles.SupplierSignUp}>

      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            {reAuth !== undefined ? t('logIn.label') : t('signUp.label')}
          </div>
          <div className={styles.subTitle}>
            {reAuth !== undefined ? t('pleaseSignInAgain.label') : t('signupStepOne.label')}
          </div>
        </div>

        <div
          className={styles.body}
          style={{
            pointerEvents: state.isError ? 'none' : 'all'
          }}
        >
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
            buttonClass={styles.dropDownContainer}
            inputClass={styles.textField}
            inputStyle={{
              padding: lang !== 'en' ? '6px 45px 6px 10px' : '6px 10px 6px 45px'
            }}
          />

          {
            reAuth !== undefined ?
              null :
              <CheckBox
                name={'agree'}
                text={ t('agreeToTheTerms.label') }
                onClick={handleCheck}
                isSupplier={isSupplier}
                error={state.isError ? state.errorMessage : undefined}
              />
          }

          <SignUpButton
            title={`${reAuth !== undefined ? t('logIn.label') : t('signUp.label')}`}
            type={'custom'}
            onClick={signUp}
            disabled={false}
            isSmall={true}
          />

          {/*<Separator title={ t('or.label') } />*/}

          {/*<SignUpButton*/}
          {/*  type={'google'}*/}
          {/*  title={ t('signUpWithGoogle.label') }*/}
          {/*  onClick={signInWithGoogle}*/}
          {/*/>*/}

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

export default SupplierSignUp
