import React, { useContext } from 'react'
import moment from 'moment'
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7z"></path></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
              <span>{ t('approve.label') }</span>
            </div> : null
        }

        {
          !item.approved ?
            <div
              className={styles.btn}
              onClick={() => handleSpecialApprove(item.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
              <span>Special Approve</span>
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

export default DashboardItemStore
