import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'

import styles from './SupplierBrand.module.scss'


const SupplierBrand = props => {

  const context = useContext(AppContext)

  const [store, setStore] = useState({
    name: '',
    logo: ''
  })

  useEffect(() => {

    if (context.currentUser !== null && context.currentUser.stores !== undefined) {
      let { stores } = context.currentUser
      let currentStore = Object.values(stores).filter(m => m.default)
      let currentStoreName = currentStore.map(m => m.storeName).toString()
      let currentStoreUrl = currentStore.map(m => m.store.storeLogo.map(m => m.url)).toString()

      if (currentStoreName.length > 0) {
        setStore({
          name: currentStoreName,
          logo: currentStoreUrl
        })
      }
    }

  }, [context.currentUser])


  return(

    <div className={styles.SupplierBrand}>
      <div
        className={styles.icon}
        style={{
          backgroundImage: store.logo.length > 0 ? `url('${store.logo}')` : '',
        }}
      />
      <div
        className={styles.title}
        style={{
          maxWidth: store.name.length > 0 ? '500px' : '0',
          opacity: store.name.length > 0 ? 1 : 0
        }}
      >
        { store.name }
      </div>
    </div>

  )

}

export default SupplierBrand
