import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
              <FontAwesomeIcon icon={'image'} />
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
          <FontAwesomeIcon icon='ban' fixedWidth />
          <span>{ t('block.label') }</span>
        </div>
        <div
          className={styles.btn}
          // onClick={() => handleComment(product.id)}
        >
          <FontAwesomeIcon icon='comment' fixedWidth />
          <span>Write a message</span>
        </div>
        <div
          className={`${styles.btn} ${state.isToggle ? styles.active : ''}`}
          onClick={() => handleToggle()}
        >
          <FontAwesomeIcon icon='eye' fixedWidth />
          <span>Details</span>
        </div>

      </div>

    </div>

  )

}

export default DashboardItemUsers
