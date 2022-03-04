import React, {useContext} from 'react'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import Separator from '../../../components/UI/Separator/Separator'

import styles from './SuppliersBalance.module.scss'
import AppContext from "../../../components/AppContext";
import {Redirect} from "react-router-dom";
// import Transactions from './Transactions/Transactions'


const SupplierBalance = ({ isTrial, approved, isSubscribed, currentStore, ...props }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()


  return(

    <div className={styles.SuppliersBalance}>

      {
        !approved && !isTrial && !isSubscribed ?
          <Redirect
            to={'/supplier/stores'}
          /> :
          approved && isTrial && !isSubscribed ?
            null :
            approved && !isTrial && isSubscribed ?
              null :
              approved && !isTrial && !isSubscribed ?
                <Redirect
                  to={'/supplier/stores'}
                /> : null
      }

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('myBalance.label') }
      </div>

      <div className='container-fluid'>
        <div className={`${styles.dashboard} row`}>
          <div
            className={`${styles.item} col-lg-4 col-12 mb-4 mb-lg-0`}
            style={{
              textAlign: lang === 'ar' ? 'right' : 'left'
            }}
          >
            <div className={styles.wrapper}>
              <div className={styles.itemTitle}>
                { t('currentBalance.label') }
              </div>
              <div className={styles.description}>
                { t('totalAmount.label') }
              </div>
              <div className={styles.total}>
                <small>{ t('aed.label') }</small>
                <div style={{width: '5px'}} />
                0.00
              </div>
            </div>
          </div>
          <div
            className={`${styles.item} col-lg-4 col-12 mb-4 mb-lg-0`}
            style={{
              textAlign: lang === 'ar' ? 'right' : 'left'
            }}
          >
            <div className={styles.wrapper}>
              <div className={styles.itemTitle}>
                { t('cashIn.label') }
              </div>
              <div className={styles.description}>
                { t('amountOnHold.label') }
              </div>
              <div className={styles.total}>
                <small>{ t('aed.label') }</small>
                <div style={{width: '5px'}} />
                0.00
              </div>
            </div>
          </div>
          <div
            className={`${styles.item} col-lg-4 col-12`}
            style={{
              textAlign: lang === 'ar' ? 'right' : 'left'
            }}
          >
            <div className={styles.wrapper}>
              <div className={styles.itemTitle}>
                { t('cashOut.label') }
              </div>
              <div className={styles.description}>
                { t('amountEligible.label') }
              </div>
              <div className={styles.total}>
                <small>{ t('aed.label') }</small>
                <div style={{width: '5px'}} />
                0.00
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row justify-content-end'>
          <div className='col-lg-4 col-12 mt-4'>
            <SignUpButton title={ t('balanceWithdraw.label') } type={'custom'} disabled={false} />
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <Separator color={'#eef1f5'} />
          </div>
        </div>
      </div>

      {/*<Transactions />*/}

    </div>

  )

}

export default SupplierBalance
