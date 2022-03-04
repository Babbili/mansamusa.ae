import React from 'react'
import moment from 'moment'

import styles from './DashboardItemAdminSubscription.module.scss'


const DashboardItemAdminSubscription = ({ item, isToggle, handleToggle, isUnsubscribe, handleCancelSubscription }) => {


  return(

    <div
      className={styles.DashboardItemAdminSubscription}
      style={{
        pointerEvents: isUnsubscribe ? 'none' : 'all'
      }}
    >

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        <div className={styles.titleWrapper}>
          <h3>Subscription Number: <span> { item.subscriptionNumber } </span></h3>
          <div className={styles.description}>
            Created at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

        {
          item.status !== 'CANC' ?
            <div
              className={styles.btn}
              onClick={() => handleCancelSubscription(item.subscriptionNumber)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
              <span>
                {
                  isUnsubscribe ?
                    'Unsubscribing...' : 'Cancel Subscription'
                }
              </span>
            </div> : null
        }

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

export default DashboardItemAdminSubscription
