import React, { useContext } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import styles from './DashboardItemStore.module.scss'
import AppContext from '../../../../AppContext'


const DashboardItemStore = ({ item, isToggle, handleToggle, handleApprove, handleSpecialApprove }) => {

  let { t } = useTranslation()
  let { isMobile } = useContext(AppContext)

  return(

    <div className={styles.DashboardItemStore}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        {
          item.store.storeLogo !== undefined && item.store.storeLogo.length > 0 ?
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(${item.store.storeLogo[0].url})`
              }}
            /> :
            <div className={styles.image}>
              <FontAwesomeIcon icon={'image'} />
            </div>
        }

        {
          isMobile ?
            <div style={{width: '10px'}} /> : null
        }

        <div className={styles.titleWrapper}>
          <h3>{ item.storeName }</h3>
          <div className={styles.description}>
            Registered at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

        {
          !item.approved ?
            <div
              className={styles.btn}
              onClick={() => handleApprove(item.id)}
            >
              <FontAwesomeIcon icon='check-circle' fixedWidth />
              <span>{ t('approve.label') }</span>
            </div> : null
        }

        {
          !item.approved ?
            <div
              className={styles.btn}
              onClick={() => handleSpecialApprove(item.id)}
            >
              <FontAwesomeIcon icon='exclamation-triangle' fixedWidth />
              <span>Special Approve</span>
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

export default DashboardItemStore
