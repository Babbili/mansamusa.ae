import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { validatePassword } from '../utils/utils'
import Input from '../../UI/Input/Input'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'

import styles from './UserResetPassword.module.scss'


const UserResetPassword = ({ state, isDone, handleReset, handleChange, history }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.UserResetPassword}>
      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            {
              isDone ?
                'All Done!' :
                t('resetPassword.label')
            }
          </div>
          <div className={styles.subTitle}>
            {
              isDone ?
                'You are successfully reset the password' :
                t('enterYourEmailYouUsed.label')
            }
          </div>
        </div>

        {
          isDone ?
            <div className={styles.body}>
              <SignUpButton
                type={'custom'}
                title={ t('logIn.label') }
                onClick={() => history.push('/login')}
                disabled={false}
                isWide={true}
              />
            </div> :
            <div className={styles.body}>

              <Input
                name='password'
                type='password'
                value={state.password}
                handleChange={handleChange}
                label={ t('newPassword.label') }
                error={!validatePassword(state.password) && state.password.length > 0}
                text={
                  !validatePassword(state.password) && state.password.length > 0 ?
                    t('useEightSymbolError.label') :
                    !validatePassword(state.password) && state.password.length === 0 ?
                      t('useEightSymbolError.label') : ''
                }
              />

              <SignUpButton
                type={'custom'}
                title={ t('resetPassword.label') }
                onClick={handleReset}
                disabled={false}
                isWide={true}
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

export default UserResetPassword
