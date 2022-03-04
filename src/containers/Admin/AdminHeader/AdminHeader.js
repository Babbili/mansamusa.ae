import React from 'react'
import AdminName from './AdminName/AdminName'
import AdminSearch from './AdminSearch/AdminSearch'

import styles from './AdminHeader.module.scss'


const AdminHeader = props => {

  return(

    <div className={`${styles.AdminHeader} container-fluid`}>
      <AdminSearch />
      <AdminName {...props} />
    </div>

  )

}

export default AdminHeader
