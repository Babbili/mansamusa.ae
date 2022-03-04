import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
import Input from '../../UI/Input/Input'

import styles from './UserForgotPassword.module.scss'


const UserForgotPassword = ({ state, error, isSent, handleSend, handleChange }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.UserForgotPassword}>
      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            {
              isSent ?
                'Message Sent' :
                t('forgotPassword.label')
            }
          </div>
          <div className={styles.subTitle}>
            {
              isSent ?
                'Please, check your email. We just sent you an email with reset password link' :
                t('enterYourEmailYouUsed.label')
            }
          </div>
        </div>

        {
          isSent ? null :
            <div className={styles.body}>

              <Input
                type='email'
                name='email'
                value={state.email}
                handleChange={handleChange}
                label={ t('enterYourEmail.label') }
                error={error.length > 0}
                text={error.length > 0 ? error : ''}
              />

              <SignUpButton
                type={'custom'}
                onClick={handleSend}
                title={ t('resetPassword.label') }
                disabled={false}
                isSmall={true}
              />

              <div className={styles.textLine}>
                <Link to={'/login'}>
                  { t('rememberMyPassword.label') }
                </Link>
              </div>

            </div>
        }

      </div>

    </div>

  )

}

export default UserForgotPassword
