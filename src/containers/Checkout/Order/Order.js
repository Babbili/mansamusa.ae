import React, { useEffect, useState } from 'react'
import OrderSidebar from '../OrderSidebar/OrderSidebar'
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
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