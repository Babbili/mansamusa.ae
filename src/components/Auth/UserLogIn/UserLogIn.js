import React, { useContext } from 'react'
import PhoneInput from 'react-phone-input-2'
import AppContext from '../../AppContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
import Separator from '../../UI/Separator/Separator'
import Input from '../../UI/Input/Input'

import styles from './UserLogIn.module.scss'
import { scrollToTop } from '../../../utils/utils';


const UserLogIn = ({ state, checkout, history, handleChange, handleSubmit, signInWithGoogle }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  return(

    <div className={styles.UserLogIn}>

      <div className={styles.wrapper}>

        {
          checkout ?
            <>
              <div className={styles.header}>
                <div className={styles.title}>
                  Don't have an account?
                </div>
              </div>
              <div className={styles.body}>
                <SignUpButton
                  disabled={false}
                  title={'Proceed as a guest'}
                  type={'custom'}
                  onClick={() => {
                    history.push({
                      pathname: '/checkout',
                      state: {
                        user: 'guest'
                      }
                    })
                    scrollToTop(0, 'smooth')
                  }}
                  isWide={true}
                />
                <Separator title={ t('or.label') } color={'#ccc'} />
              </div>
            </> : null
        }

        <div className={styles.header}>
          <div className={styles.title}>
            { t('logIn.label') }
          </div>
        </div>

        <div className={styles.body}>

          {
            state.email.length > 3 ?
              null :
              <PhoneInput
                autoFormat={false}
                disableDropdown={true}
                inputProps={{name: 'phone'}}
                country={'ae'}
                placeholder={ t('enterYourContactNumber.label') }
                value={state.phone}
                onChange={(value, country, e, formattedValue) => {
                  handleChange(e)
                }}
                containerClass={styles.phoneContainer}
                buttonClass={styles.dropDownContainer}
                inputClass={styles.textField}
                inputStyle={{
                  padding: lang !== 'en' ? '6px 45px 6px 10px' : '6px 10px 6px 45px'
                }}
              />
          }

          {
            (state.isError && state.errorCode === 'auth/invalid-phone-number') ||
            (state.isError && state.errorCode === 'nouser') ?
              <div className={styles.phoneError}>
                { state.error }
              </div> : null
          }

          {
            state.phone.length > 5 ?
              <div style={{height: '20px'}} /> :
              <>
                <Input
                  name='email'
                  type='text'
                  label={ t('enterYourEmail.label') }
                  value={state.email}
                  handleChange={handleChange}
                  error={state.errorCode === 'auth/invalid-email' || state.errorCode === 'auth/user-not-found'}
                  text={state.errorCode === 'auth/invalid-email' || state.errorCode === 'auth/user-not-found' ? state.error : ''}
                />

                <Input
                  name='password'
                  type='password'
                  label={ t('enterYourPassword.label') }
                  value={state.password}
                  handleChange={handleChange}
                  error={state.errorCode === 'auth/wrong-password' || state.errorCode === 'auth/too-many-requests'}
                  text={state.errorCode === 'auth/wrong-password' || state.errorCode === 'auth/too-many-requests' ? state.error : ''}
                />

                <div className={styles.forgot}>
                  <Link to={'/forgot-password'}>
                    { t('forgotPassword.label') }
                  </Link>
                </div>
              </>
          }

          <SignUpButton
            disabled={false}
            title={ t('logIn.label') }
            type={'custom'}
            onClick={handleSubmit}
            isWide={true}
          />

          {/*<Separator title={ t('or.label') } />*/}

          {/*<SignUpButton*/}
          {/*  title={ t('signInWithGoogle.label') }*/}
          {/*  type={'google'}*/}
          {/*  onClick={signInWithGoogle}*/}
          {/*/>*/}

          <div className={styles.textLine}>
            { t('dontHaveAnAccount.label') } <Link to={'/signup'}>{ t('signUp.label') }</Link>
          </div>

        </div>

      </div>

    </div>

  )

}

export default UserLogIn
