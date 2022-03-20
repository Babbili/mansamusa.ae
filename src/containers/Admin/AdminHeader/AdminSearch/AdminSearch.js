import React from 'react'
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path></svg>
          </button>
        </span>
      </div>
    </div>

  )

}

export default AdminSearch
