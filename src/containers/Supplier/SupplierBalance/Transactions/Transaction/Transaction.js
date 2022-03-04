import React, { useContext } from 'react'
import AppContext from '../../../../../components/AppContext'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import { useTranslation } from 'react-i18next'

import styles from './Transaction.module.scss'


const Transaction = ({ transaction }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  moment.locale(lang)

  return(

    <div className={styles.Transaction}>
      <div className={styles.number}>
        { t('transactionNo.label') } { transaction.tracking_id }
      </div>
      <div className={styles.order}>
        { t('orderNo.label') } { transaction.order_id }
      </div>
      <div className={styles.amount}>
        { t('aed.label') } { transaction.amount }
        <div className={styles.helpNote}>
          { moment.unix(transaction.date).format('LL') }
        </div>
      </div>
    </div>

  )

}

export default Transaction
