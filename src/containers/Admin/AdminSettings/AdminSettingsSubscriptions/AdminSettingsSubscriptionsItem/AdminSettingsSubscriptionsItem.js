import React, { useContext } from 'react'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AdminSettingsSubscriptionsItem.module.scss'


const AdminSettingsSubscriptionsItem = ({ item, handleEdit, handleRemove }) => {


  const context = useContext(AppContext)
  let { lang } = context


  return(

    <div className={`${styles.AdminSettingsSubscriptionsItem} col-12 mb-4`}>

      <div className={styles.wrapper}>

        <div className={styles.title}>

          <div className={styles.titleWrapper}>
            <span>
              { item.name }
            </span>
              { item.unit_amount.toLocaleString() } { item.currency[lang] } / { item.interval[lang].toLowerCase() }
          </div>

          {/* <div className={styles.btnWrapper}>
            <div className={styles.btn} onClick={() => handleEdit(item)}>
              <FontAwesomeIcon icon={'pencil-alt'} fixedWidth />
            </div>
            <div className={styles.btn} onClick={() => handleRemove(item)}>
              <FontAwesomeIcon icon={'times'} fixedWidth />
            </div>
          </div> */}


        </div>

      </div>

    </div>

  )

}

export default AdminSettingsSubscriptionsItem