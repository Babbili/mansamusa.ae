import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../AppContext'
import Input from '../UI/Input/Input'

import styles from './CustomerPaymentForm.module.scss'


const CustomerPaymentForm = ({ hide, data, orderId }) => {

  const context = useContext(AppContext)
  const { currentUser } = context
  let formRef = useRef()

  const [form, setForm] = useState({
    customer_identifier: '',
    tid: new Date().getTime(),
    merchant_id: 46560,
    order_id: '',
    currency: "AED",
    amount: '',
    redirect_url: "",
    cancel_url: "",
    billing_name: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
    billing_country: "",
    billing_tel: '',
    billing_email: "",
    merchant_param1: '',
    merchant_param2: '',
    merchant_param3: '',
    vault: ''
  })
  const [isPay, setIsPay] = useState(false)

  useEffect(() => {

    if (orderId !== null && data.isPay) {

      setForm(prevState => {
        return {
          ...prevState,
          customer_identifier: data.uid.length > 0 ? data.uid : 'anonymous',
          tid: new Date().getTime(),
          merchant_id: 46560,
          order_id: orderId,
          currency: "AED",
          amount: data.total,
          redirect_url: "https://mansamusa.ae/checkout/payment/response",
          cancel_url: "https://mansamusa.ae/checkout/delivery",
          billing_name: `${data.firstName} ${data.lastName}`,
          billing_address: data.customerAddress,
          billing_city: data.city,
          billing_state: "",
          billing_zip: "",
          billing_country: data.country,
          billing_tel: data.phone,
          billing_email: data.email,
          merchant_param1: orderId,
          merchant_param2: data.uid.length > 0 ? data.uid : 'anonymous',
          merchant_param3: 'p3',
          vault: 'Y'
        }
      })

      setIsPay(true)

    }

  }, [data, orderId, currentUser])

  useEffect(() => {
    if (isPay) {
      setTimeout(() => {
        document.forms[0].submit()
      }, 500)
    }
  }, [isPay])

  const handleFormData = event => {

    let {name, value} = event.target

    setForm({
      ...form,
      [name]: value
    })

  }


  return (

    <div
      className={`${styles.CustomerPaymentForm} container-fluid`}
      style={{
        height: hide ? '0' : 'auto'
      }}
    >

      <div className='row'>

        <form
          ref={formRef}
          id='customerPay'
          method='post'
          name='customerData'
          action='https://mansamusa.ae/checkout/payment'
        >

          <Input
            name='customer_identifier'
            type='text'
            label='customer_identifier'
            value={form.customer_identifier}
            handleChange={handleFormData}
          />

          <Input
            name='tid'
            type='text'
            label='Enter card number'
            value={form.tid}
            handleChange={handleFormData}
          />

          <Input
            name='merchant_id'
            type='text'
            label='Merchant Id'
            value={form.merchant_id}
            handleChange={handleFormData}
          />

          <Input
            name='order_id'
            type='text'
            label='Order Id'
            value={form.order_id}
            handleChange={handleFormData}
          />

          <Input
            name='currency'
            type='text'
            label='Currency'
            value={form.currency}
            handleChange={handleFormData}
          />

          <Input
            name='amount'
            type='number'
            label='Amount'
            value={form.amount}
            handleChange={handleFormData}
          />

          <Input
            name='redirect_url'
            type='text'
            label='Redirect URL'
            value={form.redirect_url}
            handleChange={handleFormData}
          />

          <Input
            name='cancel_url'
            type='text'
            label='Cancel URl'
            value={form.cancel_url}
            handleChange={handleFormData}
          />

          <Input
            name='billing_name'
            type='text'
            label='Billing Name'
            value={form.billing_name}
            handleChange={handleFormData}
          />

          <Input
            name='billing_address'
            type='text'
            label='Billing Address'
            value={form.billing_address}
            handleChange={handleFormData}
          />

          <Input
            name='billing_city'
            type='text'
            label='Billing City'
            value={form.billing_city}
            handleChange={handleFormData}
          />

          <Input
            name='billing_state'
            type='text'
            label='Billing State'
            value={form.billing_state}
            handleChange={handleFormData}
          />

          <Input
            name='billing_zip'
            type='text'
            label='Billing Zip'
            value={form.billing_zip}
            handleChange={handleFormData}
          />

          <Input
            name='billing_country'
            type='text'
            label='Billing Country'
            value={form.billing_country}
            handleChange={handleFormData}
          />

          <Input
            name='billing_tel'
            type='text'
            label='Billing Tel'
            value={form.billing_tel}
            handleChange={handleFormData}
          />

          <Input
            name='billing_email'
            type='text'
            label='Billing Email'
            value={form.billing_email}
            handleChange={handleFormData}
          />

          <Input
            name='merchant_param1'
            type='text'
            label='merchant_param1'
            value={form.merchant_param1}
            handleChange={handleFormData}
          />

          <Input
            name='merchant_param2'
            type='text'
            label='merchant_param2'
            value={form.merchant_param2}
            handleChange={handleFormData}
          />

          <Input
            name='merchant_param3'
            type='text'
            label='merchant_param3'
            value={form.merchant_param3}
            handleChange={handleFormData}
          />

          <Input
            name='vault'
            type='text'
            label='vault'
            value={form.vault}
            handleChange={handleFormData}
          />

          <button type='submit'>
            Pay
          </button>

        </form>

      </div>

    </div>

  )

}

export default CustomerPaymentForm
