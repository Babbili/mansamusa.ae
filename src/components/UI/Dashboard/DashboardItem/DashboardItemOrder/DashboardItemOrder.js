import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
              <FontAwesomeIcon icon='ban' fixedWidth />
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
              <FontAwesomeIcon icon='times-circle' fixedWidth />
              <span>Cancel Order</span>
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

export default DashboardItemOrder
