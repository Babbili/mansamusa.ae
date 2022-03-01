import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './DashboardItemSupplierAbandoned.module.scss'


const DashboardItemSupplierAbandoned = ({ item, isToggle, handleToggle }) => {


  return(

    <div className={styles.DashboardItemSupplierAbandoned}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        <div className={styles.titleWrapper}>
          <h3>Created at: <span> { moment.unix(item.createdAt).format('LLLL') } </span></h3>
          {/*<div className={styles.description}>*/}
          {/*  Created at { moment.unix(item.createdAt).format('LLLL') }*/}
          {/*</div>*/}
        </div>
      </div>

      <div className={styles.btnWrapper}>

        {/*<div*/}
        {/*  className={styles.btn}*/}
        {/*  onClick={() => handleAccept(item.id)}*/}
        {/*>*/}
        {/*  <FontAwesomeIcon icon='bell' fixedWidth />*/}
        {/*  <span>Send Notification</span>*/}
        {/*</div>*/}

        <div
          className={`${styles.btn} ${isToggle ? styles.active : ''}`}
          onClick={() => handleToggle()}
        >
          <FontAwesomeIcon icon='eye' fixedWidth />
          <span>Details</span>
        </div>

      </div>

    </div>

  )

}

export default DashboardItemSupplierAbandoned
