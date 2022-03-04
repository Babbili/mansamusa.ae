import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import styles from './AdminSearch.module.scss'


const AdminSearch = props => {

  let { t } = useTranslation()

  return(

    <div className={styles.AdminSearch}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.textField}
          placeholder={ t('search.label') }
          aria-describedby="basic-addon1"
        />
        <span className={styles.inputGroupAddon} id="basic-addon1">
          <button className={styles.searchBtn}>
            <FontAwesomeIcon icon="search" fixedWidth />
          </button>
        </span>
      </div>
    </div>

  )

}

export default AdminSearch
