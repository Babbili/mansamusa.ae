import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Download.module.scss'
import google from './../../assets/google.png'
import apple from './../../assets/apple.png'
// import img from './../../assets/app.png'


const Download = props => {

  const { t } = useTranslation()

  return(

    <div className={`${styles.Download} container-fluid`}>
      <div className={styles.title}>
        { t('downloadMansaMusaApp.label') }
      </div>
      <div className={styles.appIcons}>
        <div
          className={styles.icon}
          style={{
            backgroundImage: `url(${google})`
          }}
        />
        <div
          className={styles.icon}
          style={{
            backgroundImage: `url(${apple})`
          }}
        />
      </div>
      {/*<div className={styles.appImage}>*/}
      {/*  <img src={img} alt='app preview' />*/}
      {/*</div>*/}
    </div>

  )

}

export default Download
