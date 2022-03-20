import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import pluralize from 'pluralize'
import SupplierStoreMessage from '../SupplierStoreMessage/SupplierStoreMessage'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'

import styles from './SupplierStoreCard.module.scss'


const SupplierStoreCard = ({ stores, handleDefault, isTrial, isSubscribed, ...props }) => {

  let { t, lang } = props
  let { url } = useRouteMatch()
  const { storeName, product, approved, id, trialExpiresIn } = props.store
  const storesQuantity = stores.length
  
  useEffect(()=> console.log(`props.store${storeName}`, props.store) )

  return(

    <div className={`${styles.SupplierStoreCard} col-lg-6 col-12 mb-4`}>
      <div className={styles.wrapper}>
        <div className={styles.contain}>
        <div className={styles.itemTitle}>
          <div className={styles.name}>
            <div>{ storeName }</div>
            <div className={styles.description}>
              { typeof product === 'object' ? product[lang] : product } Store
            </div>
          </div>
          <div className={styles.total}>
          {
            approved ?
              <SignUpButton
                type={'custom'}
                title={ t('edit.label') }
                onClick={() => props.history.push(`${url}/edit-store/${id}`)}
                disabled={false}
              /> : null
          }
          
          </div>
          
        </div>
        
            {
              approved ?
              <div className={styles.appr__container}>
                <div className={styles.done}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#5cb85c"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
                  <p>{ t('approved.label') }</p>
                </div>
                {
                  storesQuantity > 1 && !props.store.default ?
                    <SignUpButton
                      type={'custom'}
                      title={ t('setAsDefault.label') }
                      onClick={() => handleDefault(id)}
                      disabled={false}
                    /> : null
                }
              </div> :
                <div className={styles.approval}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="20" r="2"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="6.343" cy="17.657" r="2"></circle><circle cx="17.657" cy="6.343" r="2"></circle><circle cx="4" cy="12" r="2.001"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="6.343" cy="6.344" r="2"></circle><circle cx="17.657" cy="17.658" r="2"></circle></svg>
                  { t('inApproval.label') }
                </div>
            }

          
        </div>
        
        {
          !approved && !isTrial && !isSubscribed ?
            <SupplierStoreMessage
              t={t}
              isTrial={isTrial}
              approved={approved}
              isSubscribed={isSubscribed}
              message={`Thank you for creating ${storeName} store with us. Our managers will approve it shortly.`}
              storesQuantity={storesQuantity}
              {...props}
            /> :
            approved && isTrial && !isSubscribed ?
              <SupplierStoreMessage
                t={t}
                isTrial={isTrial}
                approved={approved}
                isSubscribed={isSubscribed}
                message={`Your 3 days trial for ${storeName} ends in ${trialExpiresIn < 0 ? 0 : trialExpiresIn} ${pluralize('day', trialExpiresIn)}.`}
                storesQuantity={storesQuantity}
                {...props}
              /> :
              approved && !isTrial && isSubscribed ?
                null :
                approved && !isTrial && !isSubscribed ?
                  <SupplierStoreMessage
                    t={t}
                    isTrial={isTrial}
                    approved={approved}
                    isSubscribed={isSubscribed}
                    message={`Your ${storeName} Trial subscription is expired. Subscribe to unlock all features`}
                    storesQuantity={storesQuantity}
                    {...props}
                  /> : null
        }

        
      </div>
    </div>

  )

}

export default SupplierStoreCard
