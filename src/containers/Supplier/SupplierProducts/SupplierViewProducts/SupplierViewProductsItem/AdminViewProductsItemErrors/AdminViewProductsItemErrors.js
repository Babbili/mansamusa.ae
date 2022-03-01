import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './AdminViewProductsItemErrors.module.scss'


const AdminViewProductsItemErrors = ({ lang, errors }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.AdminViewProductsItemErrors}>

      <div className={styles.title}>
        { t('errors.label') }
      </div>

      <div className={styles.details}>
        {
          errors.map((e, i) => (
            <div
              key={i}
              className={styles.item}
              style={{
                margin: `${lang !== 'en' ? '0 0 10px 10px' : '0 10px 10px 0'}`
              }}
            >
              { e.title }
            </div>
          ))
        }
      </div>

    </div>

  )

}

export default AdminViewProductsItemErrors
