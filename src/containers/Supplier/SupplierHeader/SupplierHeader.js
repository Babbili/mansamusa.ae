import React from 'react'
import SupplierBrand from './SupplierBrand/SupplierBrand'
import SupplierSearch from './SupplierSearch/SupplierSearch'
import SupplierName from './SupplierName/SupplierName'

import styles from './SupplierHeader.module.scss'


const SupplierHeader = props => {

  return(

    <div className={`${styles.SupplierHeader} container-fluid`}>
      <SupplierBrand />
      
      <SupplierName {...props} />
    </div>

  )

}

export default SupplierHeader
