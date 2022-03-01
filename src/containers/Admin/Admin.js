import React, { useState, useRef } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import AdminSidebar from './AdminSidebar/AdminSidebar'
import AdminCustomers from './AdminCustomers/AdminCustomers'
import AdminStores from './AdminStores/AdminStores'
import AdminSubscriptions from './AdminSubscriptions/AdminSubscriptions'
import AdminProducts from './AdminProducts/AdminProducts'
import AdminOrders from './AdminOrders/AdminOrders'
import AdminCurrencies from './AdminCurrencies/AdminCurrencies'
import AdminCountriesRegions from './AdminCountriesRegions/AdminCountriesRegions'
import AdminInvitations from './AdminInvitations/AdminInvitations'
import AdminReports from './AdminReports/AdminReports'
import AdminSuppliers from './AdminSuppliers/AdminSuppliers'
import AdminDashboard from './AdminDashboard/AdminDashboard'
import AdminAbandonedCarts from './AdminAbandonedCarts/AdminAbandonedCarts'
import AdminAbandonedWishlists from './AdminAbandonedWishlists/AdminAbandonedWishlists'
import SignUpButton from '../../components/UI/SignUpButton/SignUpButton'
import styles from './Admin.module.scss'
import AdminSettings from './AdminSettings/AdminSettings';


const Admin = props => {

  let { path } = useRouteMatch()
  const [isToggle, setIsToggle] = useState(false)
  const admBar = useRef()

  return(

    <div className={`${styles.Admin} bd__container`}>
   
          {
           window.innerWidth <= 769 ?
             <div className='col-12'>
               <SignUpButton
                 type={'custom'}
                 title={'Menu'}
                 isWide={true}
                 icon={'bars'}
                 onClick={() => setIsToggle(!isToggle)}
                 disabled={false}
               />
             </div> : null
          }

        <div className={styles.Admin__container}>
          <div className={ isToggle ? styles.open : styles.hide } ref={admBar} >
            <AdminSidebar isToggle={isToggle} setIsToggle={setIsToggle} {...props}  />
          </div>
        
          <Redirect
            to={`${path}/dashboard`}
          />


          <Switch className={styles.switch__container}>

            <Route path={`${path}/dashboard`} exact render={props => <AdminDashboard {...props} /> } />

            <Route path={`${path}/customers`} exact render={props => <AdminCustomers {...props} /> } />

            <Route path={`${path}/suppliers`} exact render={props => <AdminSuppliers {...props} /> } />

            <Route path={`${path}/stores`} render={props => <AdminStores {...props} /> } />

            <Route path={`${path}/subscriptions`} render={props => <AdminSubscriptions {...props} /> } />

            <Route path={`${path}/products`} render={props => <AdminProducts {...props} /> } />

            <Route path={`${path}/orders`} render={props => <AdminOrders {...props} /> } />

            <Route path={`${path}/countries-and-regions`} render={props => <AdminCountriesRegions {...props} /> } />

            <Route path={`${path}/currencies`} render={props => <AdminCurrencies {...props} /> } />

            <Route path={`${path}/invitations`} render={props => <AdminInvitations {...props} /> } />

            <Route path={`${path}/settings`} render={props => <AdminSettings {...props} /> } />

            <Route path={`${path}/reports`} render={props => <AdminReports {...props} /> } />

            <Route path={`${path}/abandoned-carts`} render={props => <AdminAbandonedCarts {...props} /> } />

            <Route path={`${path}/abandoned-wishlists`} render={props => <AdminAbandonedWishlists {...props} /> } />

          </Switch>
        </div>
        

      

    </div>

  )

}

export default Admin
