import React from 'react'
import { scrollToTop } from '../../../../../utils/utils'
import styles from './SupplierViewProductsAdd.module.scss'


const SupplierViewProductsAdd = ({ title, description, number, filter, currentFilter, handleTopFilters, ...props }) => {


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
          <h3>Add New</h3>
          <div className={styles.description}>
            or add multiple products
          </div>
        </div>
        <div className={styles.right}>
          <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
          </h3>
        </div>
      </div>
    </div>

  )

}

export default SupplierViewProductsAdd
