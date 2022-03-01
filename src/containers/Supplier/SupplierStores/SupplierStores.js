import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import firebase, { firestore } from '../../../firebase/config'
import AppContext from '../../../components/AppContext'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import SupplierStoresDashboard from './SupplierStoresDashboard/SupplierStoresDashboard'
import SupplierCreateStore from '../../../components/Auth/SupplierCreateStore/SupplierCreateStore'

import styles from './SupplierStores.module.scss'


const SupplierStores = ({ isTrial, approved, currentStore, isSubscribed, setCurrentStore, ...props }) => {

  localStorage.removeItem('storeCreate')
  localStorage.removeItem('storeLogo')
  localStorage.removeItem('tradeLicense')
  localStorage.removeItem('nationalId')
  localStorage.removeItem('document')
  localStorage.removeItem('taxRegCertificate')
  localStorage.removeItem('address')

  let { path, url } = useRouteMatch()
  const context = useContext(AppContext)
  let { lang, currentUser } = context
  let { t } = useTranslation()
  const [stores, setStores] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('stores')
      .onSnapshot(snapshot => {
        let stores = []
        snapshot.forEach(doc => {
          stores = [...stores, {id: doc.id, ...doc.data()}]
        })
        setStores(stores)
        setIsLoaded(true)
      })

    }

  }, [currentUser, isLoaded])

  const handleDefault = id => {

    const ids = stores.map(f => f.id)

    let store = firebase.firestore().collection('users')
    .doc(context.currentUser.uid)
    .collection('stores')

    ids.map(m => {

      if (m === id) {
        store.doc(m).update({
          default: true
        }).then(() => {})
      } else {
        store.doc(m).update({
          default: false
        }).then(() => {})
      }

      return null

    })

  }


  return(

    <div className={styles.SupplierStores}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('myStores.label') }
      </div>

      {
        isLoaded ?
          <Switch>

            <Route
              path={path}
              exact
              render={ props =>
                <SupplierStoresDashboard
                  t={t}
                  url={url}
                  lang={lang}
                  stores={stores}
                  isTrial={isTrial}
                  approved={approved}
                  isSubscribed={isSubscribed}
                  currentStore={currentStore}
                  setCurrentStore={setCurrentStore}
                  handleDefault={handleDefault}
                  {...props}
                />
              }
            />

            <Route path={`${path}/add-new-store`} exact render={props =>
              <div className='container-fluid'>
                <div className={`${styles.dashboard} row`}>
                  <SupplierCreateStore newStore={true} {...props} />
                </div>
              </div>
            } />

            <Route path={`${path}/edit-store/:id`} exact render={props =>
              <div className='container-fluid'>
                <div className={`${styles.dashboard} row`}>
                  <div className='col-12'>
                    <SupplierCreateStore newStore={true} editStore={true} {...props} />
                  </div>
                </div>
              </div>
            } />

          </Switch> :
          <BasicSpinner />
      }

    </div>

  )

}

export default SupplierStores
