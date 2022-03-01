import React from 'react'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'


import styles from './DeliveryAddress.module.scss'


const DeliveryAddress = ({ address, handleSend, ...props }) => {


  return(

    <div className={styles.DeliveryAddress}>

      <div className='col-12 py-3'>

        <div className={styles.item}>
          <span>
            Delivery Address
          </span>
        </div>

      </div>

      <div className='col-12'>

        <div className={styles.footerWrapper}>

          <div className={styles.delivery}>
            <div className={styles.left}>
              { address.customerAddress }
            </div>
          </div>

          <div className={styles.delivery}>
            <div className={styles.left}>
              { address.area }
            </div>
          </div>

          <div className={styles.delivery}>
            <div className={styles.left}>
              Building Name or #: { address.building }
            </div>
          </div>

          <div className={styles.delivery}>
            <div className={styles.left}>
              Floor: { address.floor }
            </div>
          </div>

          <div className={styles.delivery}>
            <div className={styles.left}>
              Unit: { address.unit }
            </div>
          </div>

        </div>

        <div className={styles.footerWrapper}>

          <SignUpButton
            title={'Change'}
            type={'custom'}
            onClick={() => props.history.goBack()}
            disabled={false}
          />

        </div>

      </div>

    </div>

  )

}

export default DeliveryAddress
