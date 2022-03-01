import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
import Input from '../../UI/Input/Input'

import styles from './UserOTP.module.scss'


const UserOTP = ({ reAuth, state, reSendOTP, verifyOTP, handleChange }) => {

  const context = useContext(AppContext)
  let { t } = useTranslation()


  return(

    <div className={styles.UserOTP}>

      <div className={styles.wrapper}>

        <div className={styles.header}>
          <div className={styles.title}>
            { t('verifyYourPhoneNumber.label') }
          </div>
          <div className={styles.subTitle}>
            { reAuth !== undefined ? '' : t('signupStepTwo.label') }
          </div>
        </div>

        <div className={styles.body}>

          <div className={styles.textLine}>
            { t('oneTimePassword.label') }
            {context.supplierAuth.phone !== undefined ? context.supplierAuth.phone : state.phone},
            { t('pleaseEnterTheSame.label') }
          </div>

          <Input
            label={'OTP'}
            name={'code'}
            value={state.code}
            type={'number'}
            handleChange={handleChange}
            error={state.isError}
            text={state.isError ? state.error : ''}
          />

          <SignUpButton
            title={ t('verify.label') }
            type={'custom'}
            onClick={verifyOTP}
            disabled={false}
            isWide={true}
          />

          <div className={styles.textLine} onClick={reSendOTP}>
            { state.reSend ? t('sendingNewOTP.label') : t('resendOTP.label') }
          </div>

        </div>

      </div>
    </div>

  )

}

export default UserOTP
