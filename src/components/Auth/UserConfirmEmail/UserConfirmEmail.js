import React from 'react'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'

import styles from './UserConfirmEmail.module.scss'


const UserConfirmEmail = ({ state, isDone, handleClick }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.UserConfirmEmail}>
      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            {
              isDone ?
                'All Done!' :
                t('confirmEmail.label')
            }
          </div>
          <div className={styles.subTitle}>
            {
              isDone ? 'You are successfully confirmed your email' : ''
            }
          </div>
        </div>

        {
          isDone ? null :
            <div className={styles.body}>

              <SignUpButton
                type={'custom'}
                title={ t('confirm.label') }
                onClick={handleClick}
                disabled={false}
                isSmall={true}
              />

              <div className={styles.textLine}>
                {
                  state.error.length > 0 ?
                    <div className={styles.error}>
                      { state.error }
                    </div> : ''
                }
              </div>

            </div>
        }

      </div>
    </div>

  )

}

export default UserConfirmEmail
