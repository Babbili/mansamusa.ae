import React, { useContext } from 'react'
import AppContext from '../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './AdminCurrencyItem.module.scss'


const AdminCurrencyItem = ({ item, handleEditCurrency, handleRemoveCurrency }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <div
      className={`${styles.AdminCurrencyItem} col-lg-4 col-12 mb-4`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <div className={styles.wrapper}>

        <div className={styles.itemTitle}>
          { item.currency.code }
          <span>
            <FontAwesomeIcon
              icon="edit"
              fixedWidth
              onClick={() => handleEditCurrency(item)}
            />
            <div style={{width: 5}} />
            <FontAwesomeIcon
              icon="times-circle"
              fixedWidth
              onClick={() => handleRemoveCurrency(item.id)}
            />
          </span>
        </div>

      </div>

    </div>

  )

}

export default AdminCurrencyItem
