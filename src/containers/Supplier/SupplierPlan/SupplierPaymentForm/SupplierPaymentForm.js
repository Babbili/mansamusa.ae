import React, { useState } from 'react'
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import Input from '../../../../components/UI/Input/Input'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import ps from '../../../../assets/powered-by-stripe.png'
import styles from './SupplierPaymentForm.module.scss'
import { firestore } from '../../../../firebase/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const SupplierPaymentForm = ({ selected, isLoading, currentUser, currentStore, handleCancel, subscriptionData }) => {

  let { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  // Get the lookup key for the price from the previous page redirect.
  const [clientSecret] = useState(subscriptionData.clientSecret)
  const [subscriptionId] = useState(subscriptionData.subscriptionId)
  const [name, setName] = useState(currentUser.displayName)
  const [messages, _setMessages] = useState('')
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [disable, setDisable] = useState(false)

  // helper for displaying status messages.
  const setMessage = (message) => {
    _setMessages(`${messages}\n\n${message}`)
  }

  // Initialize an instance of stripe.
  const stripe = useStripe()
  const elements = useElements()

  if (!stripe || !elements) {
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    return ''
  }

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)
    setDisable(true)
    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use card Element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        }
      }
    })

    if (paymentIntent.status === 'succeeded') {
      // save subscriptions to firebase
      await firestore
        .collection('subscriptions')
        .add({
          subscriptionId: selected.id,
          stripe: {
            customerId: currentStore.stripe.customerId,
            subscriptionId,
            paymentIntent
          }
        })
    }

    if (error) {
      // show error and collect new card details.
      setLoading(false)
      setMessage(error.message)
      return
    }

    setPaymentIntent(paymentIntent)
    setLoading(false)
  }


  const handleChange = e => {
    setName(e.target.value)
  }
 

  return(

    <div className='row mt-5 d-flex justify-content-center'>

      {
        paymentIntent ?
          <div className='col-md-6 col-12 my-5'>
            <div className={styles.success}>
              <div className={styles.icon}>
                <FontAwesomeIcon icon={'check'} fixedWidth />
              </div>
              Payment Successful!
            </div>
          </div> :
          <div className='col-md-6 col-12'>

            <div className='row'>

              <div className='col-12 mb-2'>
                <Input
                  name={'name'}
                  type={'text'}
                  value={name}
                  label={'Name on card'}
                  handleChange={handleChange}
                />
              </div>

              <div className='col-12 mb-4'>

                <div className={styles.cardForm}>

                  <CardElement
                    options={{
                      hidePostalCode: true
                    }}
                  />

                </div>
                
              </div>

              <div className='col-md-8 col-6 mb-3'>

                <SignUpButton
                  isActive={true}
                  type={'custom'}
                  loading={loading}
                  title={ t('payNow.label') }
                  onClick={(e) => handleSubmit(e)}
                  disabled={disable}
                />

              </div>

              <div className='col-md-4 col-6 mb-3'>

                <SignUpButton
                  type={'custom'}
                  loading={isLoading}
                  title={ t('cancel.label') }
                  onClick={() => handleCancel(subscriptionId)}
                  disabled={false}
                />

              </div>

              <div className='col-12 d-flex justify-content-center'>

                <img
                  src={ps}
                  alt={'Powered by Stripe'}
                  style={{
                    maxWidth: '350px',
                    width: '100%',
                    height: 'auto'
                  }}
                />

              </div>

              <div className='col-12 mb-3'>
                { messages }
              </div>

            </div>

          </div>
      }

    </div>

  )

}

export default SupplierPaymentForm