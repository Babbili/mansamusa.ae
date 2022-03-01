import React, { useContext, useEffect, useState, useRef } from 'react'
import { firestore } from '../../firebase/config'
import AppContext from '../../components/AppContext'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SupplierPlan from './SupplierPlan/SupplierPlan'
import SupplierOrders from './SupplierOrders/SupplierOrders'
import SupplierStores from './SupplierStores/SupplierStores'
import SupplierInvite from './SupplierInvite/SupplierInvite'
import SupplierProfile from './SupplierProfile/SupplierProfile'
import SupplierBalance from './SupplierBalance/SupplierBalance'
import SupplierReports from './SupplierReports/SupplierReports'
import SupplierSidebar from './SupplierSidebar/SupplierSidebar'
import SupplierProducts from './SupplierProducts/SupplierProducts'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import SupplierAbandonedCarts from './SupplierAbandonedCarts/SupplierAbandonedCarts'
import SupplierAbandonedWishlists from './SupplierAbandonedWishlists/SupplierAbandonedWishlists'
import SignUpButton from '../../components/UI/SignUpButton/SignUpButton'
import styles from './Supplier.module.scss'


const Supplier = props => {

  const context = useContext(AppContext)
  let { currentUser, isMobile } = context
  let { path } = useRouteMatch()
  const { t } = useTranslation()

  const [currentStore, setCurrentStore] = useState(null)
  const [approved, setApproved] = useState(null)
  const [isTrial, setIsTrial] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(null)

  useEffect(() => {

    if (currentUser.type === 'supplier' && currentUser.completed === false) {

      props.history.push('/create-store')

    }

  }, [props, currentUser])

  useEffect(() => {

    if (currentStore !== null) {
      setApproved(currentStore.approved)
      setIsTrial(currentStore.isTrial)
      setIsSubscribed(currentStore.isSubscribed)
    }

  }, [currentStore])

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users')
      .doc(currentUser.uid)
      .collection('stores')
      .where('default', '==', true)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          setCurrentStore({id: doc.id, ...doc.data()})
        })
      })

    }

  }, [currentUser])

  useEffect(() => {
    if (props.location.pathname === '/supplier') {
      props.history.push(`${path}/profile`)
    }
  }, [path, props])

  const [isToggle, setIsToggle] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const ssBar =useRef()

  return(

    <div className={`${styles.Supplier} bd__container`}>

      {
        currentUser !== null && currentStore !== null &&
          approved !== null && isTrial !== null && isSubscribed !== null ?
          <div>

              {
                window.innerWidth <= 769 ?
                  <div className='col-12'>
                    <SignUpButton
                      type={'custom'}
                      title={t('menu.label')}
                      isWide={true}
                      icon={'bars'}
                      onClick={() => setIsToggle(!isToggle)}
                      disabled={false}
                    />
                  </div> : null
              }

            <div className={styles.Supplier__container}>
              <div className={ isToggle ? styles.open : styles.hide } ref={ssBar} >
                <SupplierSidebar isToggle={isToggle} setIsToggle={setIsToggle} {...props} />
              </div>
              <Switch className={styles.switch__container}>

                <Route path={`${path}/profile`} exact render={props => <SupplierProfile {...props} /> } />
                <Route path={`${path}/stores`} render={props =>
                    <SupplierStores
                      isTrial={isTrial}
                      approved={approved}
                      isSubscribed={isSubscribed}
                      currentStore={currentStore}
                      setCurrentStore={setCurrentStore}
                      {...props}
                    />
                  }
                />
                <Route path={`${path}/products`} render={props =>
                  <SupplierProducts
                    isTrial={isTrial}
                    approved={approved}
                    isSubscribed={isSubscribed}
                    currentStore={currentStore}
                    {...props}
                  />
                }
                />
                <Route path={`${path}/orders`} exact render={props =>
                  <SupplierOrders
                    isTrial={isTrial}
                    approved={approved}
                    isSubscribed={isSubscribed}
                    currentStore={currentStore}
                    {...props}
                  />
                }
                />
                <Route path={`${path}/balance`} exact render={props =>
                  <SupplierBalance
                    isTrial={isTrial}
                    approved={approved}
                    isSubscribed={isSubscribed}
                    currentStore={currentStore}
                    {...props}
                  />
                }
                />
                <Route path={`${path}/plan`} exact render={props =>
                  <SupplierPlan
                    isTrial={isTrial}
                    approved={approved}
                    isSubscribed={isSubscribed}
                    currentStore={currentStore}
                    {...props}
                  />
                }
                />
                <Route path={`${path}/invite`} exact render={props =>
                    <SupplierInvite
                      isTrial={isTrial}
                      approved={approved}
                      isSubscribed={isSubscribed}
                      currentStore={currentStore}
                      {...props}
                    />
                  }
                />
                <Route path={`${path}/reports`} exact render={props =>
                    <SupplierReports
                      isTrial={isTrial}
                      approved={approved}
                      isSubscribed={isSubscribed}
                      {...props}
                    />
                  }
                />
                <Route path={`${path}/abandoned-carts`} exact render={props =>
                    <SupplierAbandonedCarts
                      isTrial={isTrial}
                      approved={approved}
                      isSubscribed={isSubscribed}
                      currentStore={currentStore}
                      {...props}
                    />
                  }
                />
                <Route path={`${path}/abandoned-wishlists`} exact render={props =>
                    <SupplierAbandonedWishlists
                      isTrial={isTrial}
                      approved={approved}
                      isSubscribed={isSubscribed}
                      currentStore={currentStore}
                      {...props}
                    />
                  }
                />

              </Switch>

            </div>

          </div> :
          <div className='row min-vh-100'>
            <div className='col-12 mb-4'>
              <BasicSpinner />
            </div>
          </div>
      }

    </div>

  )

}

export default Supplier
