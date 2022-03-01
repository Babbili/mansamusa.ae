import React, { useContext, useEffect, useState } from 'react'
import Steps from '../../../components/UI/Steps/Steps'
import AppContext from '../../../components/AppContext'
import CheckoutSidebar from '../CheckoutSidebar/CheckoutSidebar'
import { validateEmail } from '../../../components/Auth/utils/utils'
import AddressForm from '../../../components/AddressForm/AddressForm'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import ButtonSpinner from '../../../components/UI/ButtonSpinner/ButtonSpinner'

import styles from './Delivery.module.scss'
import { checkCustomerExistence, createCustomer } from '../utils/utils';


const Delivery = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isSubscribe: false,
    country: '',
    city: '',
    address: '',
    state: '',
    zipcode: '',
    isBillingAddress: false
  })

  const [link, setLink] = useState('')
  const [isError, setIsError] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // check if delivery in localstorage
  useEffect(() => {

    let delivery = localStorage.getItem('delivery')

    if (!delivery) return

    setState(JSON.parse(delivery))

  }, [])

  const handleChange = e => {

    const { name, value } = e.target

    setState({
      ...state,
      [name]: value
    })

  }

  const handleChangeSelect = e => {

    const { name, value } = e.target

    setState({
      ...state,
      [name]: typeof JSON.parse(value) === 'object' ? JSON.parse(value) : value
    })

  }

  const handleCheckbox = (name, isChecked) => {

    setState(prevState => {
      return {
        ...prevState,
        [name]: isChecked
      }
    })

  }

  const handleNext = async () => {

    // validation
    if (validate(state)) {

      setIsValid(true)
      let cus = localStorage.getItem('customer')
      localStorage.setItem('delivery', JSON.stringify(state))

      if (cus) {
        setTimeout(() => {
          props.history.push({
            pathname: '/checkout/payment',
            state: {
              customer: cus,
              delivery: state
            }
          })
        }, 1500)
      } else {

        // check if stripe customer exist
        let customers = await checkCustomerExistence(state.email)
        let customer

        // if exist get from stripe
        if (customers.length > 0) {
          customer = customers[0]
          localStorage.setItem('customer', customer.id)
        } else {
          // else create customer
          customer = await createCustomer(state)
          localStorage.setItem('customer', customer.id)
        }

        setTimeout(() => {
          props.history.push({
            pathname: '/checkout/payment',
            state: {
              customer: customer.id,
              delivery: state
            }
          })
        }, 1500)
      }

    } else {
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 1500)
    }

  }

  const validate = state => {

    if (state.firstName.length > 2) {
      if (state.lastName.length > 2) {
        if (validateEmail(state.email)) {
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
    } else {
      return false
    }

  }

  useEffect(() => {

    if (state.firstName.length > 2) {
      if (state.lastName.length > 2) {
        if (validateEmail(state.email)) {
          if (typeof state.country === 'object') {
            if (state.address.length > 0) {
              if (typeof state.city === 'object') {
                if (state.phone.length > 0) {
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
          setLink('#email')
        }
      } else {
        setLink('#lastName')
      }
    } else {
      setLink('#firstName')
    }

  }, [state])


  return(

    <div className={styles.Delivery}>

      <div className='col-lg-8 col-12'>

        <div className='row'>

          <div className='col-12 mb-4'>
            <Steps index={0} />
          </div>

          <div className='col-12 mb-3 mt-4'>
            <div className={styles.title}>
              Delivery Information
            </div>
          </div>

          <div className='col-12 mb-3 mt-4'>
            <div className={styles.description}>
              * Required fields<br/>
              {/*Please fill in the "Name" and "Surname" fields in Latin letters in accordance with your passport data. The rest of the fields can be filled in both Latin and Arabic.*/}
            </div>
          </div>

          <AddressForm
            lang={lang}
            link={link}
            state={state}
            isError={isError}
            type={'delivery'}
            handleChange={handleChange}
            handleCheckbox={handleCheckbox}
            handleChangeSelect={handleChangeSelect}
          />

        </div>

      </div>

      <div className='col-lg-8 col-12'>
        <CheckoutSidebar>
          <SignUpButton
            type={'custom'}
            title={!isValid ? 'Save and Continue' : <ButtonSpinner />}
            onClick={() => handleNext()}
            disabled={false}
            isWide={true}
          />
        </CheckoutSidebar>
      </div>

    </div>

  )

}

export default Delivery
