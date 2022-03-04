import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'
import { firestore } from '../../../../firebase/config'

import styles from './SupplierBrand.module.scss'
import {Link} from "react-router-dom";


const SupplierBrand = props => {

  const context = useContext(AppContext)
  const { currentUser } = context

  const [store, setStore] = useState({
    name: '',
    id: '',
    logo: ''
  })

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('stores')
      .where('default', '==', true)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          setStore(prevState => {
            return {
              ...prevState,
              name: doc.data().storeName,
              id: doc.data().id,
              logo: doc.data().store.storeLogo.length > 0 ? doc.data().store.storeLogo[0].url : '',
              approved: doc.data().approved
            }
          })
        })
      })

    }

  }, [currentUser])


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

        {
          store.approved ?
            <Link to={`/store/${store.id}`}>
              { store.name }
            </Link> :
            store.name
        }

      </div>
    </div>

  )

}

export default SupplierBrand
