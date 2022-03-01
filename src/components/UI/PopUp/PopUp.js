import React from 'react'
import SignUpButton from '../SignUpButton/SignUpButton'

import styles from './PopUp.module.scss'


const PopUp = ({ title, isError, setIsError }) => {

  const handleClose = () => {
    setIsError(!isError)
  }

  return(

    <div className={styles.PopUp} onClick={handleClose}>
      <div className={styles.wrapper}>
        <h3>Please Fill All Mandatory Fields</h3>
        <SignUpButton title={title} onClick={handleClose} type={'custom'} disabled={false} />
      </div>
    </div>

  )

}

export default PopUp
