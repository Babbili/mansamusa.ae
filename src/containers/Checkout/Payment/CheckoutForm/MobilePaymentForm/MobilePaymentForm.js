import React, { useState, useEffect } from 'react'
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js'
import ButtonSpinner from '../../../../../components/UI/ButtonSpinner/ButtonSpinner'


const MobilePaymentForm = ({ cart, fee, currency }) => {

  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] = useState(null)

  useEffect(() => {

    // if (!cart) return

    let subTotal = cart.reduce((a, b) =>{
      if(b.price > 100) {
       return (a + (b.quantity * b.price * 1.1))
      } else {
       return (a + (b.quantity * (b.price + 10)))
      }
    }, 0)
    let delivery = 0 
    let feeTotal = 0
    let total = (subTotal + delivery) + feeTotal

    if (stripe && total) {
      const pr = stripe.paymentRequest({
        country: 'AE',
        currency: currency,
        total: {
          label: 'MansaMusa FZE',
          amount: total,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr)
        }
      })

    }

  }, [fee, cart, stripe, currency])

  if (paymentRequest) {
    return(
      <div className='col-12'>
        <PaymentRequestButtonElement options={{paymentRequest}} />
      </div>
    )
  }

  // Use a traditional checkout form.
  return(

    <div className='col-12'>
      <ButtonSpinner />
    </div>

  )
}

export default MobilePaymentForm