import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { scrollToTop } from '../../../../../utils/utils'

import styles from './SupplierViewProductsAdd.module.scss'
import { useTranslation } from 'react-i18next'

const SupplierViewProductsAdd = ({ title, description, number, filter, currentFilter, handleTopFilters, ...props }) => {
const { t } = useTranslation()


  return(

    <div
      className={`${styles.SupplierViewProductsAdd} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      onClick={() => {
        props.history.push('/supplier/products/add-new')
        scrollToTop(0, 'auto')
      }}
    >
      <div className={`${styles.wrapper}`}>
        <div className={styles.left}>
          <h3>{ t('addProduct.label') }</h3>
          <div className={styles.description}>
            {t('addMultipleProducts.label')}
          </div>
        </div>
        <div className={styles.right}>
          <h3>
            <FontAwesomeIcon icon='plus-circle' fixedWidth />
          </h3>
        </div>
      </div>
    </div>

  )

}

export default SupplierViewProductsAdd
