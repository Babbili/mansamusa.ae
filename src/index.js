import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { loadStripe } from '@stripe/stripe-js'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'

import './index.scss'

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

    ReactDOM.render(
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </BrowserRouter>,
      document.getElementById('root')
    )

  

// const app = (
//   <BrowserRouter>
//     <Elements stripe={stripePromise}>
//       <App />
//     </Elements>
//   </BrowserRouter>
// )
// ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
