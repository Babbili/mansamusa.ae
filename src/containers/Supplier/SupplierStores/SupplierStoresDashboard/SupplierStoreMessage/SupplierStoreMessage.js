import React from 'react'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'

import styles from './SupplierStoreMessage.module.scss'



const SupplierStoreMessage = ({ t, message, isTrial, approved, isSubscribed, storesQuantity, ...props }) => {


  return(

    <>

      <div className={styles.SupplierStoreMessage} >

            <p>
              { message }
            </p>

            {
              !approved && !isTrial && !isSubscribed ?
                null :
                storesQuantity > 1 && !props.store.default ?
                <p>Set this store as default to Subscribe</p> :
                approved && isTrial && !isSubscribed ?
                  <SignUpButton
                    type={'custom'}
                    title={ t('subscribeNow.label') }
                    onClick={ async () => {
                      props.history.push('/supplier/plan')
                    }}
                    disabled={false}
                  /> :
                  approved && !isTrial && isSubscribed ?
                    null :
                    approved && !isTrial && !isSubscribed ?
                      <SignUpButton
                        type={'custom'}
                        title={ t('subscribeNow.label') }
                        onClick={async () => {
                          props.history.push('/supplier/plan')
                        }}
                        disabled={false}
                      /> : null
            }

      </div>

    </>

  )

}

export default SupplierStoreMessage
