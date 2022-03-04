import React, { useState, useEffect, useContext } from 'react'
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { saveOrder, updateCustomerBillingAddress } from '../../utils/utils'
import AppContext from '../../../../components/AppContext'
import MobilePaymentForm from './MobilePaymentForm/MobilePaymentForm'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import ButtonSpinner from '../../../../components/UI/ButtonSpinner/ButtonSpinner'

import styles from './CheckoutForm.module.scss'


export default function CheckoutForm(props) {

  const context = useContext(AppContext)
  const { cart } = context

  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {

    if (!cart) return
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("https://payments-ms-zwmlxysbza-uc.a.run.app/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart,
          delivery: 0,
          fee: 0,
          currency: 'AED',
          customer: props.customer
        })
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setClientSecret(data.clientSecret)
      })
  }, [cart, props.customer])

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  }

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : "")
  }
  const[disable, setDisable]=useState(false)

  const handleSubmit = async ev => {

    let { validate, payment, delivery, isBillingAddress, customer } = props

    ev.preventDefault()
    setDisable(true)
    if (validate(payment)) {

      setProcessing(true)

      // if not billing address update customer

      if (!isBillingAddress) {
        await updateCustomerBillingAddress(payment, customer)
      }

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      })

      if (payload.error) {
        setError(`Payment failed. ${payload.error.message}`)
        setProcessing(false)
      } else {

        // send order
        const order = await saveOrder(cart, delivery)

        setError(null)
        setProcessing(false)
        setSucceeded(true)

        props.history.push({
          pathname: '/checkout/order',
          state: {
            order: order.id
          }
        })

      }

    } else {

      setError(`Complete Billing Address Information`)
      setProcessing(false)

    }

  }


  return (

    <div className={`${styles.CheckoutForm} row`} onSubmit={handleSubmit}>

      <div className='col-12 mb-4'>

        <div className='row'>

          <MobilePaymentForm
            cart={cart}
            delivery={0}
            fee={0}
            currency={'aed'}
          />

        </div>

      </div>

      <div className='col-12 mb-3'>

        <div className={styles.title}>
          Or pay with
        </div>

      </div>

      <div className='col-12 mb-4'>

        <div className={styles.cardForm}>

          <CardElement
            id="card-element"
            options={{
              cardStyle,
              hidePostalCode: true
            }}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className='col-12'>

        <div
          disabled={processing || disabled || succeeded}
          id="submit"
          style={{
            border: '0',
            width: '100%',
            background: 'transparent',
            padding: 0
          }}
        >

          <SignUpButton
            title={processing ? (
              <ButtonSpinner />
            ) : (
              "Pay now"
            )}
            type={'custom'}
            onClick={handleSubmit}
            disabled={disable}
          />

        </div>

        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}

        {/* Show a success message upon completion */}
        <p
          style={{
            display: succeeded ? 'block' : 'none'
          }}
        >
          Payment succeeded, see the result in your
          <a
            href={`https://dashboard.stripe.com/test/payments`}
          >
            {" "}
            Stripe dashboard.
          </a> Refresh the page to pay again.
        </p>

      </div>

    </div>
  )
}
