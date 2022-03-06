import React, { useContext } from 'react'
import AppContext from '../../../../../components/AppContext'
import styles from './AdminSettingsSubscriptionsItem.module.scss'


const AdminSettingsSubscriptionsItem = ({ item }) => {

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



        </div>

      </div>

    </div>

  )

}

export default AdminSettingsSubscriptionsItem