import React from 'react'
import moment from 'moment'
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
              <span>Accept</span>
            </div> : null
        }

        {
          item.isAccepted && !item.isReady ?
            <div
              className={styles.btn}
              onClick={() => handleReady(item.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
              <span>Ready to Deliver</span>
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

export default DashboardItemSupplierOrder
