import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase/config'
import Input from '../UI/Input/Input'
import moment from 'moment'

import styles from './PaymentForm.module.scss'


const PaymentForm = ({ hide, store, selected, customId, currentUser }) => {

  const [form, setForm] = useState({
    customer_identifier: '',
    tid: new Date().getTime(),
    merchant_id: 46560,
    order_id: '',
    currency: "AED",
    amount: '',
    redirect_url: "https://mansamusa.ae/supplier/plan/payment/response",
    cancel_url: "https://mansamusa.ae/supplier/plan",
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

    si_type: "FIXED",
    si_is_setup_amt: 'N',
    si_amount: 0.5,
    si_start_date: moment().format('DD-MM-YYYY'),
    si_frequency: 1,
    si_frequency_type: 'MONTH',
    si_bill_cycle: 12
  })

  // rWHUlk418XP0PSODfuURSFAJZ5P2
  // rWHUlk418XP0PSODfuURSFAJZ
  // rWHUlk418XP0PSODfuURSFAJZ5P2

  useEffect(() => {

    if (Object.values(selected).length > 0 && customId > 0) {
      return firestore.collection('users').doc(currentUser.uid)
      .collection('profile')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {

          setForm(prevState => {
            return {
              ...prevState,
              order_id: customId,
              merchant_param1: store.storeName,
              merchant_param2: selected.id,
              merchant_param3: !!store.isSpecialApprove,
              merchant_param4: currentUser.uid,
              customer_identifier: currentUser.uid.substring(0, 25),
              billing_name: doc.data().firstName + ' ' + doc.data().lastName,
              billing_address: store.address.customerAddress,
              billing_city: store.address.city.en,
              billing_country: store.address.country.en,
              billing_tel: currentUser.phoneNumber,
              billing_email: currentUser.email,
              amount: selected.price,

              si_type: selected.type,
              si_is_setup_amt: 'Y',
              si_amount: selected.price,
              si_start_date: moment().format('DD-MM-YYYY'),
              si_frequency: selected.frequency,
              si_frequency_type: selected.frequencyType,
              si_bill_cycle: selected.cycle
            }
          })

        })
      })
    }

  }, [store, selected, customId, currentUser])

  const handleFormData = event => {

    let {name, value} = event.target

    setForm({
      ...form,
      [name]: value
    })

  }

  console.log('form', form)
  console.log('store', store)

  return (

    <div
      className={`${styles.PaymentForm} container-fluid`}
      style={{
        height: hide ? '0' : 'auto'
      }}
    >

      <div className='row'>

        <form
          id='customerData'
          method='post'
          name='customerData'
          action='https://mansamusa.ae/supplier/plan/payment'
        >

          {
            Object.entries(form).map(([key, value], index) => (

              <Input
                key={index}
                name={key}
                type='text'
                label={key}
                value={value}
                handleChange={handleFormData}
              />

            ))
          }

          <button type='submit'>
            Pay
          </button>
        </form>

      </div>
    </div>

  )

}

export default PaymentForm
