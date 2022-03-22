import React, { useContext } from 'react'
import { firestore } from '../../../../../firebase/config'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AdminRegionItem.module.scss'
const AdminRegionItem = ({ item, countryId, handleEditRegion }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const removeRegion = () => {
    firestore.collection('countriesList')
    .doc(countryId).collection('regions')
    .doc(item.id).delete()
    .then(() => {})
  }

  return(

    <div className={styles.AdminRegionItem}>
      <span style={{width: '100%'}} onClick={() => handleEditRegion(item)}>
        { item.title[lang] }
      </span>
      <span className={styles.icon} onClick={() => removeRegion()}>
        <FontAwesomeIcon icon="times-circle" fixedWidth />
      </span>
    </div>

  )

}

export default AdminRegionItem
