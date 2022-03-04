import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect
} from 'react-router-dom'
import SupplierProductsAddNew from './SupplierProductsAddNew/SupplierProductsAddNew'
import SupplierViewProducts from './SupplierViewProducts/SupplierViewProducts'
import SupplierProductsAddMultiple from './SupplierProductsAddMultiple/SupplierProductsAddMultiple'
import SupplierProductsEdit from './SupplierProductsEdit/SupplierProductsEdit'

import styles from './SupplierProducts.module.scss'


const SupplierProducts = ({ isTrial, approved, isSubscribed, currentStore, ...props }) => {

  const context = useContext(AppContext)
  const { lang } = context
  let { path } = useRouteMatch()
  let location = useLocation()

  const [state, setState] = useState({})

  useEffect(() => {
    if (location.params !== undefined) {
      setState(location.params)
    }
  }, [location])


  return(

    currentStore !== null ?
    <div className={styles.SupplierProducts}>
      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { state.title }
      </div>

      {
        !approved && !isTrial && !isSubscribed ?
          <Redirect
            to={'/supplier/stores'}
          /> :
          approved && isTrial && !isSubscribed ?
            null :
            approved && !isTrial && isSubscribed ?
              null :
              approved && !isTrial && !isSubscribed ?
                <Redirect
                  to={'/supplier/stores'}
                /> : null
      }

      {
        (approved && isTrial && !isSubscribed) || (approved && !isTrial && isSubscribed) ?
          <Switch>

            <Route path={`${path}/view-products`} render={props => <SupplierViewProducts currentStore={currentStore} {...props} /> } />

            <Route path={`${path}/edit-product/:id`} render={props => <SupplierProductsEdit currentStore={currentStore} {...props} /> } />

            <Route path={`${path}/add-new`} render={props => <SupplierProductsAddNew currentStore={currentStore} {...props} /> } />

            <Route path={`${path}/add-multiple`} render={props => <SupplierProductsAddMultiple currentStore={currentStore} {...props} /> } />

          </Switch> : null
      }

    </div> : null

  )

}

export default SupplierProducts
