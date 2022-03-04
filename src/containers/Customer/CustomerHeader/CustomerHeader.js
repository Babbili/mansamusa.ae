import React from 'react'
import CustomerName from './CustomerName/CustomerName'
import CustomerSearch from './CustomerSearch/CustomerSearch'

import styles from './CustomerHeader.module.scss'


const CustomerHeader = props => {

  return(

    <div className={`${styles.CustomerHeader} container-fluid`}>
      <CustomerSearch />
      <CustomerName {...props} />
    </div>

  )

}

export default CustomerHeader
