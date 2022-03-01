import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
              <FontAwesomeIcon icon='times-circle' fixedWidth />
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
          <FontAwesomeIcon icon='eye' fixedWidth />
          <span>Details</span>
        </div>

      </div>

    </div>

  )

}

export default DashboardItemAdminSubscription
