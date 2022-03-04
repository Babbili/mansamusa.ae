import React from 'react'
import moment from 'moment'

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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
          <span>Details</span>
        </div>

      </div>

    </div>

  )

}

export default DashboardItemAdminOrder
