import React from 'react'

import styles from './Banners.module.scss'


const Banners = props => {

  return(

    <div className={styles.Banners}>

      { props.children }

    </div>

  )

}

export default Banners
