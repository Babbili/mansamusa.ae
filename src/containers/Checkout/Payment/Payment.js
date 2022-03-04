import React, { useContext, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { scrollToTop } from '../../../utils/utils'
import CheckoutForm from './CheckoutForm/CheckoutForm'
import AppContext from '../../../components/AppContext'
import Steps from '../../../components/UI/Steps/Steps'
import CheckoutSidebar from '../CheckoutSidebar/CheckoutSidebar'
import AddressForm from '../../../components/AddressForm/AddressForm'

import styles from './Payment.module.scss'

const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)


const Payment = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [state, setState] = useState({})
  const [isBillingAddress, setIsBillingAddress] = useState(false)
  const [link, setLink] = useState('')
  const [isError, setIsError] = useState(false)

  // go to top
  useEffect(() => {
    scrollToTop('0', 'auto')
  }, [])

  // check delivery state & customer
  useEffect(() => {

    let customer = props.location.state.customer
    let deliveryState = props.location.state.delivery

    if (!deliveryState && !customer) return

    if (deliveryState.isBillingAddress) {
      setIsBillingAddress(true)
      setState({
        customer,
        delivery: deliveryState,
        payment: {
          firstName: deliveryState.firstName,
          lastName: deliveryState.lastName,
          phone: deliveryState.phone,
          country: deliveryState.country,
          city: deliveryState.city,
          address: deliveryState.address,
          state: deliveryState.state,
          zipcode: deliveryState.zipcode
        }
      })
    } else {
      setState({
        customer,
        delivery: deliveryState,
        payment: {
          firstName: '',
          lastName: '',
          phone: '',
          country: '',
          city: '',
          address: '',
          state: '',
          zipcode: ''
        }
      })
    }

  }, [props])

  const validate = state => {

    if (state.firstName.length > 2) {
      if (state.lastName.length > 2) {
        if (typeof state.country === 'object') {
          if (state.address.length > 0) {
            if (typeof state.city === 'object') {
              if (state.phone.length > 0) {
                return true
              } else {
                return null
              }
            } else {
              return null
            }
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }

  }

  useEffect(() => {

    if (!state.payment) return

    if (state.payment.firstName.length > 2) {
      if (state.payment.lastName.length > 2) {
        if (typeof state.payment.country === 'object') {
          if (state.payment.address.length > 0) {
            if (typeof state.payment.city === 'object') {
              if (state.payment.phone.length > 0) {
                return true
              } else {
                setLink('#phone')
              }
            } else {
              setLink('#city')
            }
          } else {
            setLink('#address')
          }
        } else {
          setLink('#country')
        }
      } else {
        setLink('#lastName')
      }
    } else {
      setLink('#firstName')
    }

  }, [state])

  const handleChange = e => {

    const { name, value } = e.target

    setState({
      ...state,
      payment: {
        ...state.payment,
        [name]: value
      }
    })

  }

  const handleChangeSelect = e => {

    const { name, value } = e.target

    setState({
      ...state,
      payment: {
        ...state.payment,
        [name]: typeof JSON.parse(value) === 'object' ? JSON.parse(value) : value
      }
    })

  }

  const handleCheckbox = (name, isChecked) => {

    setState(prevState => {
      return {
        ...prevState,
        payment: {
          ...prevState.payment,
          [name]: isChecked
        }
      }
    })

  }

  const handleSave = async () => {
    if (validate(state.payment)) {
      console.log('billing data is valid')
      return true
    } else {
      console.log('not valid')
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 1500)
      return false
    }
  }


  return(

    <div className={styles.Payment}>

      <div className='col-md-8 col-12'>

        <div className={`${styles.paymentWrapper} row`}>

          <div className='col-12 mb-4'>
            <Steps index={1} />
          </div>

          <div className='col-12 mb-3 mt-4'>
            <div className={styles.title}>
              Payment Method
            </div>
          </div>

          <div className='col-12 mb-3 mt-4'>
            <div className={styles.description}>
              Select a payment method below
            </div>
          </div>

          <div className='col-md-12 col-12 mb-4'>

            <Elements stripe={promise}>
              <CheckoutForm
                validate={validate}
                payment={state.payment}
                delivery={state.delivery}
                customer={state.customer}
                isBillingAddress={isBillingAddress}
                {...props}
              />
            </Elements>
          </div>

          <div className='col-12 pb-4 mb-3 mt-4'>
            <div className={styles.title}>
              Billing Address
            </div>
          </div>

          <AddressForm
            lang={lang}
            link={link}
            type={'payment'}
            isError={isError}
            state={state.payment}
            handleSave={handleSave}
            handleChange={handleChange}
            handleCheckbox={handleCheckbox}
            isBillingAddress={isBillingAddress}
            handleChangeSelect={handleChangeSelect}
          />

        </div>
      </div>

      <div className='col-md-8 col-12'>
        <CheckoutSidebar />
      </div>

    </div>

  )

}

export default Payment
