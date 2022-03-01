import React from 'react'
import styles from './BasicSpinner.module.scss'

const BasicSpinner = ({ title }) => (

  <div className={styles.BasicSpinnerContainer}>
    <div className={styles.wrapper}>

      <div className={styles.spinnerOverlay}>
          <div className={styles.spinnerContainer} />
      </div>

    </div>
  </div>

)

export default BasicSpinner
