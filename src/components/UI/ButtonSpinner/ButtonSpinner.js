import React from 'react'
import styles from './ButtonSpinner.module.scss'

const ButtonSpinner = ({ title }) => (

  <div className={styles.ButtonSpinnerContainer}>
    <div className={styles.wrapper}>

      <div className={styles.spinnerOverlay}>
          <div className={styles.spinnerContainer} />
      </div>

    </div>
  </div>

)

export default ButtonSpinner
