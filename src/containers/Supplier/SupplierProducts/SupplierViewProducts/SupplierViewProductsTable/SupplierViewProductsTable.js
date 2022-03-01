import React from 'react'
import SupplierViewProductsTableBody from './SupplierViewProductsTableBody/SupplierViewProductsTableBody'
import SupplierViewProductsTableHeader from './SupplierViewProductsTableHeader/SupplierViewProductsTableHeader'

import styles from './SupplierViewProductsTable.module.scss'


const SupplierViewProductsTable = ({ t, lang, products, currentPage, limit, ...props }) => {

  return(

    <table className={styles.SupplierViewProductsTable}>
      <SupplierViewProductsTableHeader t={t} />
      <SupplierViewProductsTableBody
        t={t}
        lang={lang}
        limit={limit}
        products={products}
        currentPage={currentPage}
        {...props}
      />
    </table>

  )

}

export default SupplierViewProductsTable
