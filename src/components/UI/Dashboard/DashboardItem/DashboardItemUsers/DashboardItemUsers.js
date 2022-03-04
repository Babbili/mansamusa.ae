import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import styles from './DashboardItemUsers.module.scss'
import AppContext from '../../../../AppContext'


const DashboardItemUsers = ({ schema, state, item, handleToggle }) => {

  let { t } = useTranslation()
  let { isMobile } = useContext(AppContext)

  return(

    <div className={styles.DashboardItemUsers}>

      <div
        className={styles.left}
        onClick={() => handleToggle()}
      >

        {
          state.data.avatar !== undefined && state.data.avatar.length > 0 ?
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(${state.data.avatar[0].url})`
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
          <h3>{ state.data.firstName } { state.data.lastName }</h3>
          { schema.condition == 'supplier' ? <p>{ state.data.email }</p> : <></> }
          <div className={styles.description}>
            Registered at { moment.unix(item.createdAt).format('LLLL') }
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>

        <div
          className={styles.btn}
          // onClick={() => handleBlock(product.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-1.846.634-3.542 1.688-4.897l11.209 11.209A7.946 7.946 0 0 1 12 20c-4.411 0-8-3.589-8-8zm14.312 4.897L7.103 5.688A7.948 7.948 0 0 1 12 4c4.411 0 8 3.589 8 8a7.954 7.954 0 0 1-1.688 4.897z"></path></svg>
          <span>{ t('block.label') }</span>
        </div>
        <div
          className={styles.btn}
          // onClick={() => handleComment(product.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path><circle cx="9.5" cy="11.5" r="1.5"></circle><circle cx="14.5" cy="11.5" r="1.5"></circle></svg>
          <span>Write a message</span>
        </div>
        <div
          className={`${styles.btn} ${state.isToggle ? styles.active : ''}`}
          onClick={() => handleToggle()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path><path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path></svg>
          <span>Details</span>
        </div>

      </div>

    </div>

  )

}

export default DashboardItemUsers
