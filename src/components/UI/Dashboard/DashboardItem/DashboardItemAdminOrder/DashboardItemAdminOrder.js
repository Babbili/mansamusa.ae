import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './DashboardItemAdminOrder.module.scss'


const DashboardItemAdminOrder = ({ item, isToggle, handleToggle, handleReady, handleAccept }) => {


  return(

    <div className={styles.DashboardItemAdminOrder}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        <div className={styles.titleWrapper}>
          <h3>{ item.user.firstName } { item.user.lastName } <span>Order #: { item.id }</span></h3>
          <div className={styles.description}>
            Created at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

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

export default DashboardItemAdminOrder
