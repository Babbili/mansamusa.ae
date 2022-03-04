import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import styles from './DashboardItemOrder.module.scss'
import { firestore } from '../../../../../firebase/config';


const DashboardItemOrder = ({ item, isToggle, handleToggle, handleApprove }) => {

  let { t } = useTranslation()

  const [isCancelledOrder, setIsCancelledOrder] = useState(false)

  const handleCancelOrder = id => {

    firestore.collectionGroup('orders')
    .where('orderId', '==', id)
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        firestore.doc(doc.ref.path)
        .update({
          isCanceled: true,
          cancellationReason: 'Canceled by the customer.'
        })
        .then(() => {})
      })
    })

  }

  // check if possible to cancel
  useEffect(() => {

    firestore.collectionGroup('supplierOrders')
    .where('orderId', '==', item.orderId)
    .onSnapshot(snap => {
      let orders = []
      snap.forEach(doc => {
        orders = [...orders, doc.data()]
      })
      orders = orders.filter(f => f.isDeliveryPlaced).filter(f => !f.isCanceled)
      setIsCancelledOrder(orders.length === 0)
    })

  }, [item.orderId])


  return(

    <div className={styles.DashboardItemOrder}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        <div className={styles.titleWrapper}>
          <h3>{ item.id }</h3>
          <div className={styles.description}>
            Created at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

        {
          !item.approved ?
            handleApprove !== undefined ?
            <div
              className={styles.btn}
              onClick={() => handleApprove(item.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-1.846.634-3.542 1.688-4.897l11.209 11.209A7.946 7.946 0 0 1 12 20c-4.411 0-8-3.589-8-8zm14.312 4.897L7.103 5.688A7.948 7.948 0 0 1 12 4c4.411 0 8 3.589 8 8a7.954 7.954 0 0 1-1.688 4.897z"></path></svg>
              <span>{ t('approve.label') }</span>
            </div> : null : null
        }

        {
          !item.isCanceled ?
            <div
              className={styles.btn}
              style={{
                // pointerEvents: item.isDeliveryPlaced ? 'none' : 'all',
                cursor: !isCancelledOrder ? 'not-allowed' : 'pointer'
              }}
              onClick={() => {
                if (isCancelledOrder) {
                  handleCancelOrder(item.id)
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
              <span>Cancel Order</span>
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

export default DashboardItemOrder
