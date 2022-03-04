import React from 'react'
import Order from './Order/Order'
import Payment from './Payment/Payment'
import Delivery from './Delivery/Delivery'
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect
} from 'react-router-dom'

import styles from './Checkout.module.scss'


const Checkout = props => {

  let location = useLocation()
  let { path } = useRouteMatch()

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }

  let query = useQuery()
  let status = query.get('status')
  let orderId = query.get('orderId')

  console.log('props.location.pathname', props.location.pathname)

  return(

    <div className={`${styles.Checkout} container-fluid`}>

      {
        props.location.pathname === '/checkout' ?
          <Redirect
            to={{
              pathname: '/checkout/delivery',
              state: {
                user: location.state !== undefined ? location.state.user : ''
              }
            }}
          /> : null
      }

      <div className='row'>

        <div className='col-12 mb-4'>
          <div className={styles.title}>
            {
              props.location.pathname !== '/checkout/order' ?
                'Checkout' : ''
            }
            {/*<span>Need Help?</span>*/}
          </div>
        </div>

        <div className='col-12'>

          <Switch>

            <Route path={`${path}/delivery`} render={props =>
                <Delivery
                  status={status}
                  orderId={orderId}
                  {...props}
                />
              }
            />

            <Route path={`${path}/payment`} render={props => <Payment {...props} /> } />

            <Route path={`${path}/order`} render={props => <Order {...props} /> } />

          </Switch>

        </div>

        <div className='col-12'>
          <div style={{height: '100px'}} />
        </div>

      </div>

    </div>

  )

}

export default Checkout
