import React from 'react'
import SupplierCreateStore from '../../components/Auth/SupplierCreateStore/SupplierCreateStore'

import styles from './CreateStore.module.scss'


const CreateStore = props => {

  return(

    <div className={styles.CreateStore}>

      <SupplierCreateStore {...props} />

    </div>

  )

}

export default CreateStore
