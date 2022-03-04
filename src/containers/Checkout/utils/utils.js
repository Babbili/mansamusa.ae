import { firestore } from '../../../firebase/config'
import moment from 'moment'


export const createCustomer = async state => {

  return fetch('https://payments-ms-zwmlxysbza-uc.a.run.app/create-customer', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state: state })
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data.customer
    })

}

export const updateCustomerBillingAddress = async (state, customer) => {

  return fetch('https://payments-ms-zwmlxysbza-uc.a.run.app/update-customer-billing-address', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ customer: customer, state: state })
  })
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data.status
    })

}

export const checkCustomerExistence = async email => {

  return fetch('https://payments-ms-zwmlxysbza-uc.a.run.app/check-user-existence', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data.customers
    })

}

export const saveOrder = async (cart, address) => {

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

  return await firestore.collection('orders')
    .add({
      createdAt: moment().unix(),
      items: cart,
      user: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
      },
      address: {
        country: address.country,
        city: address.city,
        address: address.address,
        state: address.state,
        zipcode: address.zipcode
      },
      isDelivered: false,
      isAccepted: false,
      isCanceled: false,
      isDeliveryPlaced: false,
      notRegistered: true,
      total
    })

}