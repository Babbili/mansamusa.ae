import React, { useEffect, useState } from 'react'
import OrderSidebar from '../OrderSidebar/OrderSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'

import styles from './Order.module.scss'


const Order = props => {

  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    setOrderId(props.location.state.order)
  }, [props])


  return(

    <div className={styles.Order}>

      <div className='col-lg-12 col-12 mb-4'>

        <div className='row'>

          <div className='col-12 mb-4 d-flex justify-content-center'>

            <div className={styles.wrapper}>

              <div className={styles.icon}>
                <FontAwesomeIcon icon={'check'} fixedWidth />
              </div>

              <div className={styles.title}>
                Payment Complete!
              </div>

              <div className={styles.description}>
                Thank you, your payment has been successful.
                A confirmation email has been sent to email@mail.ru
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className='col-lg-12 col-12 mb-4'>

        <OrderSidebar
          orderId={orderId}
        />

      </div>

      <div className='col-lg-12 col-12 mb-4'>
        <div className={styles.btnWrapper}>
          <SignUpButton title={'Manage Order'} type={'custom'} disabled={false} />
        </div>
      </div>

    </div>

  )

}

export default Order