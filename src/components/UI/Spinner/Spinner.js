import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Spinner.module.scss'

const Spinner = ({ title, newStore }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.SpinnerContainer}>
      <div
        className={styles.wrapper}
        style={{
          boxShadow: newStore ? 'none' : '0 5px 15px rgba(0, 0, 0, .5)'
        }}
      >

        <div className={styles.header}>
          <div className={styles.title}>
            { t('processing.label') }
          </div>
          <div className={styles.subTitle}>
            { t('pleaseWaitSecond.label') }
          </div>
        </div>

        <div className={styles.spinnerOverlay}>
          <div className={styles.spinnerContainer} />
        </div>
      </div>
    </div>

  )

}

export default Spinner
