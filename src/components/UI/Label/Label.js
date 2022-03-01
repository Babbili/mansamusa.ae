import React from 'react'
import styles from './Label.module.scss'


const Label = ({ title }) => {

  return(

    <div className={styles.Label}>
      <div className={styles.wrapper}>
        { title }
      </div>
    </div>

  )

}

export default Label
