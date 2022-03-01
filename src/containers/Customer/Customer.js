import React, { useState, useRef } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import CustomerDashboard from './CustomerDashboard/CustomerDashboard'
import CustomerSidebar from "./CustomerSidebar/CustomerSidebar";
import CustomerProfile from "./CustomerProfile/CustomerProfile";
import CustomerAddresses from "./CustomerAddresses/CustomerAddresses";
import CustomerOrders from "./CustomerOrders/CustomerOrders";
import SignUpButton from '../../components/UI/SignUpButton/SignUpButton'

import styles from './Customer.module.scss'


const Customer = props => {

  let { path } = useRouteMatch()
  const [isToggle, setIsToggle] = useState(false)
  const cusBar = useRef()



  return(

    <div className={`${styles.Customer} bd__container`}>

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

        <div className={styles.Customer__container}>
          <div className={ isToggle ? styles.open : styles.hide } ref={cusBar} >
            <CustomerSidebar isToggle={isToggle} setIsToggle={setIsToggle} {...props} />
          </div>

          {
          path === '/customer' ?
            <Redirect
              to={`${path}/dashboard`}
            /> : null
          }

          <Switch className={styles.switch__container}>

            <Route path={`${path}/dashboard`} exact render={props => <CustomerDashboard {...props} /> } />

            <Route path={`${path}/profile`} exact render={props => <CustomerProfile {...props} /> } />

            <Route path={`${path}/orders`} exact render={props => <CustomerOrders {...props} /> } />

            <Route path={`${path}/addresses`} exact render={props => <CustomerAddresses {...props} /> } />

          </Switch>
        </div>
    </div>

  )

}

export default Customer
