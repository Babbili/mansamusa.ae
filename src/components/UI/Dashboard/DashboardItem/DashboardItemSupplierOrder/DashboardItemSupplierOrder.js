import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './DashboardItemSupplierOrder.module.scss'


const DashboardItemSupplierOrder = ({ item, isToggle, handleToggle, handleReady, handleAccept }) => {


  return(

    <div className={styles.DashboardItemSupplierOrder}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        <div className={styles.titleWrapper}>
          <h3>Order Number: <span> { item.id }</span></h3>
          <div className={styles.description}>
            Created at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

        {
          !item.isAccepted && !item.isCanceled ?
            <div
              className={styles.btn}
              onClick={() => handleAccept(item.id)}
            >
              <FontAwesomeIcon icon='check-circle' fixedWidth />
              <span>Accept</span>
            </div> : null
        }

        {
          item.isAccepted && !item.isReady ?
            <div
              className={styles.btn}
              onClick={() => handleReady(item.id)}
            >
              <FontAwesomeIcon icon='check-circle' fixedWidth />
              <span>Ready to Deliver</span>
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

export default DashboardItemSupplierOrder
