import React, { useContext, useEffect, useState } from 'react'
import DashboardItemDetailsWidget from './DashboardItemDetailsWidget/DashboardItemDetailsWidget'
import DashboardItemDetailsTable from './DashboardItemDetailsTable/DashboardItemDetailsTable'
import DatePicker from 'react-date-picker'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'

import styles from './DashboardItemDetails.module.scss'
import Radio from "../../../Radio/Radio";
import Input from "../../../Input/Input";
import SignUpButton from "../../../SignUpButton/SignUpButton";
import BasicSpinner from '../../../BasicSpinner/BasicSpinner';
import axios from 'axios';
import AppContext from '../../../../AppContext';
import { firestore } from '../../../../../firebase/config'


const DashboardItemDetails = ({ lang, item, tables, merchantId, collection, currentStore }) => {

  const context = useContext(AppContext)
  const { currentUser } = context
  moment.locale(lang)

  const [state, setState] = useState({
    deliveryDate: '',
    boxOptions: [
      {
        radioName: {
          en: 'Medium Box',
          ar: 'برج'
        },
        selected: true,
        value: 'medium',
        description: 'Max Weight: 7Kg/box. Size : 45 cm x 45 cm x 45cm.'
      },
      {
        radioName: {
          en: 'My Own Package',
          ar: 'بناء'
        },
        selected: false,
        value: 'no box',
        description: 'Use your own box'
      },
    ],
    boxOption: {
      radioName: {
        en: 'Medium Box',
        ar: 'برج'
      },
      selected: true,
      value: 'medium',
      description: 'Max Weight: 7Kg/box. Size : 45 cm x 45 cm x 45cm.'
    },
    quantity: 0,
    pickupTime: 0,
    deliveryTime: 0
  })

  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const [isPlaced, setIsPlaced] = useState(false)

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false)
      }, 2500)
    }
  }, [isError])

  const handleChangeDate = value => {

    let pickUpFormatted = moment(value).format('YYYY-MM-DD 08:00:00')
    let pickUpTs = moment(pickUpFormatted).unix() * 1000
    let deliveryFormatted = moment(value).format('YYYY-MM-DD 11:00:00')
    let deliveryTs = moment(deliveryFormatted).unix() * 1000

    setState(prevState => {
      return {
        ...prevState,
        deliveryDate: value,
        pickupTime: pickUpTs,
        deliveryTime: deliveryTs
      }
    })

  }

  const handleBoxOptionsChange = ({ target }) => {

    const boxOptions = state.boxOptions.map(type => {
      if (type.radioName[lang] !== target.name) {
        return {
          ...type,
          selected: false
        }
      } else {
        return {
          ...type,
          selected: true
        }
      }
    })

    let option = boxOptions.filter(f => f.selected)[0]

    if (option.value === 'no box') {
      setState({
        ...state,
        boxOptions,
        boxOption: option,
        quantity: 0
      })
    } else {
      setState({
        ...state,
        boxOptions,
        boxOption: option
      })
    }

  }

  const handleChange = event => {

    let { name, value } = event.target

    setState({
      ...state,
      [name]: value
    })

  }

  const handleDelivery = async () => {

    setIsPlaced(true)

    let data = {
      orderUid: item.orderId,
      merchantId,
      boxOption: state.boxOption,
      quantity: state.quantity,
      deliveryAddress: item.deliveryAddress,
      user: item.user,
      paymentOptions: item.paymentOptions,
      pickupTime: state.pickupTime,
      deliveryTime: state.deliveryTime,
      price: item.paymentOptions.value !== 1 ? item.total : 0,
      storeName: item.storeName
    }

    if (validate()) {
      await axios.post('https://mansamusa.ae/delivery/set', data)
      .then(res => {
        if (res.data.status === 'success') {

          // Send delivery email
          const name = currentUser.displayName
          const email = currentUser.email
          const phone = currentUser.phoneNumber
          const orderNumber = item.orderId

          if(currentStore.store.country.en == 'UAE') {
            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'supplierOrderConfirmedUAE',
                data: {
                  subject: `Thank you for your confirmation for order #${orderNumber}.`,
                  previewText: `Thank you for your confirmation for order #${orderNumber}. Delivery team will contact you to confirm on time of pick up on the number`,
                  displayName: name,
                  orderNumber: orderNumber,
                  phone: phone
                },
              },
            })
            .then(r => {})
          } else if(currentStore.store.country.en == 'Russia') {
            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'supplierOrderConfirmedRussia',
                data: {
                  subject: `Спасибо Вам за подтверждение заказа #${orderNumber}.`,
                  previewText: `Наша группа доставки свяжется с Вами в ближайшее время для подтверждения времени доставки по контактному номеру`,
                  displayName: name,
                  orderNumber: orderNumber,
                  phone: phone
                },
              },
            })
            .then(r => {})
          } else {

          firestore.collection('mail')
          .add({
            to: email,
            template: {
              name: 'supplierOrderConfirmed',
              data: {
                subject: `Thank you for your confirmation for order #${orderNumber}.`,
                previewText: `Thank you for your confirmation for order #${orderNumber}. Delivery team will contact you to confirm on time of pick up on the number`,
                displayName: name,
                orderNumber: orderNumber,
                phone: phone
              },
            },
          })
          .then(r => {})
          }
          setIsPlaced(false)
        } else {
          setIsError(true)
          setIsPlaced(false)
        }
      })
    } else {
      setIsPlaced(false)
    }

  }

  const validate = () => {

    if (state.boxOption.value === 'medium') {

      if (state.quantity > 0) {
        if (state.pickupTime > 0) {
          return true
        } else {
          setIsError(true)
          setError('Choose a delivery date.')
          return false
        }
      } else {
        setIsError(true)
        setError('Required field if box is selected.')
        return false
      }

    } else {
      if (state.pickupTime > 0) {
        return true
      } else {
        setIsError(true)
        setError('Choose a delivery date.')
        return false
      }
    }

  }


  return(

    <div className={`${styles.DashboardItemDetails} col-12`}>

      <div className='row'>

        {
          item.dashboard !== undefined ?
            item.dashboard.map((d, i) => (

              <DashboardItemDetailsWidget
                key={i}
                title={d.title}
                description={d.description}
                value={d.value}
              />

            )) : null
        }

      </div>

      {
        // delivery is placed
        collection === 'supplierOrders' && item.isDeliveryPlaced && !item.isCanceled ?
          <div className='row mb-4'>
            <div className='col-12 mb-2'>
              <div className={styles.title}>
                Delivery # { item.deliveryId }
              </div>
            </div>
            <div className='col-12'>
              <div className={styles.deliveryBox}>
                <div className={styles.attention}>
                  Your products will be collected on&nbsp;
                  { moment.unix(item.pickupTime/1000).format('LLLL') }&nbsp;
                  from your pickup location. We are using an Ahoy Services for all our deliveries.&nbsp;
                  Please check for <a href={'https://mansamusa.ae/assets/deliveryPolicy.pdf'} target='_blank' rel='noopener noreferrer' >Ahoy Delivery Policy.</a>
                </div>
              </div>
            </div>
          </div> : null
      }

      {
        item.isCanceled ?
          <div className='row mb-4'>
            <div className='col-12 mb-2'>
              <div className={styles.title}>
                Order has been canceled
              </div>
            </div>
            <div className='col-12'>
              <div className={styles.deliveryBox}>
                <div className={styles.attention}>
                  Details: { item.cancellationReason }<br/>
                </div>
              </div>
            </div>
          </div> : null
      }

      {
        // delivery form
        collection === 'supplierOrders' && !item.isDeliveryPlaced ?
          !isPlaced ?
            <>

              {
                item.isReady ?
                  <div className='row mb-4'>

                    <div className='col-12'>

                      <div className={`${styles.deliveryBox} row`}>

                        <div className='col-12 mb-3'>
                          <div className={styles.title}>
                            Do you need a box to pack a products?
                          </div>
                        </div>

                        <div className='col-12 d-flex mb-1'>
                          {
                            state.boxOptions.map((type, index) => {
                              return(
                                <Radio
                                  key={index}
                                  index={index}
                                  title={type.radioName[lang]}
                                  selected={type.selected}
                                  handleInputChange={handleBoxOptionsChange}
                                />
                              )
                            })
                          }
                        </div>

                        <div className='col-12 d-flex mb-4'>
                          { state.boxOption.description }
                        </div>

                        <div className='col-6 mb-3'>

                          <div className='row'>

                            <div className='col-12 mb-3'>
                              <div className={styles.title}>
                                Quantity of the boxes?
                              </div>
                            </div>

                            <div className='col-12'>
                              <Input
                                name='quantity'
                                type='number'
                                label='Box quantity'
                                value={state.quantity}
                                error={isError && state.quantity === 0 && state.boxOption.value === 'medium'}
                                text={
                                  isError && state.quantity === 0 && state.boxOption.value === 'medium' ?
                                    error : null
                                }
                                handleChange={handleChange}
                                disabled={state.boxOption.value === 'no box'}
                              />
                            </div>

                          </div>

                        </div>

                        <div className='col-6 mb-3'>

                          <div className='row'>

                            <div className='col-12 mb-3'>
                              <div className={styles.title}>
                                Choose a Delivery Date
                              </div>
                            </div>

                            <div id='deliveryDate' className='col-12'>
                              <DatePicker
                                className={styles.datePickerInput}
                                onChange={handleChangeDate}
                                value={state.deliveryDate}
                                minDate={moment().add('1', 'day').toDate()}
                                maxDate={moment().add('5', 'days').toDate()}
                                required={true}
                                dayPlaceholder={'Day'}
                                monthPlaceholder={'Month'}
                                yearPlaceholder={'Year'}
                                format={'dd MMMM y'}
                              />

                              {
                                (state.boxOption.value === 'medium' && state.quantity > 0 && state.pickupTime === 0 && isError) ||
                                (state.boxOption.value !== 'medium' && state.quantity === 0 && state.pickupTime === 0 && isError) ?
                                  <div
                                    className={`${styles.dateError} ${styles.red}`}
                                  >
                                    { error }
                                  </div> : null
                              }

                              {
                                state.pickupTime > 0 ?
                                  <div
                                    className={styles.dateError}
                                  >
                                    Your products will be collected on&nbsp;
                                    { moment.unix(state.pickupTime/1000).format('LLLL') }&nbsp;
                                    from your pickup location. We are using an Ahoy Services for all our deliveries.&nbsp;
                                    Please check for <a href={'https://mansamusa.ae/assets/deliveryPolicy.pdf'} target='_blank' rel='noopener noreferrer'>Ahoy Delivery Policy.</a>
                                  </div> : null
                              }

                            </div>

                          </div>

                        </div>

                        <div className='col-12 justify-content-center d-flex'>

                          <div className='row'>
                            <div className='col-12'>
                              <SignUpButton
                                title={'Set Delivery'}
                                type={'custom'}
                                onClick={handleDelivery}
                                disabled={false}
                                isWide={true}
                              />
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div> : null
              }

              {
                !item.isAccepted && !item.isDeliveryPlaced && !item.isCanceled ?
                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className={styles.deliveryBox}>
                        <div className={styles.attention}>
                          <div className={styles.title}>
                            You now have 24 hours to accept the order*
                          </div><br/>
                          * In the case of order cancellation due to supplier inability to accept the order within 24 hour a penalty of 15 % of the total amount of the order will be charged and requested to be paid from the supplier side.<br/>
                        </div>
                      </div>
                    </div>
                  </div> : null
              }

              {
                !item.isReady && !item.isDeliveryPlaced && !item.isCanceled ?
                  <div className='row mb-4'>
                    <div className='col-12'>
                      <div className={styles.deliveryBox}>
                        <div className={styles.attention}>
                          <div className={styles.title}>
                            You are given a maximum of 5 days from the date of accepting order to accept the delivery pick up* otherwise the order will be canceled and the customer will be informed with the order cancellation and there will be penalties on the supplier side.
                          </div><br/>
                          * In the case of order cancellation due to supplier inability to accept the delivery date within 3 days a penalty of 30 % of the total amount of the order will be charged and requested to be paid from the supplier side.
                        </div>
                      </div>
                    </div>
                  </div> : null
              }

            </> :
            <div className='row mb-4 mt-4'>
              <div className='col-12'>
                <div className={styles.deliveryBox}>
                  <div
                    className={styles.attention}
                    style={{
                      padding: '55px 0'
                    }}
                  >
                    <BasicSpinner />
                  </div>
                </div>
              </div>
            </div> : null
      }

      {
        tables.map((table, index) => (

          <DashboardItemDetailsTable
            key={index}
            item={item}
            index={index}
            table={table}
            tables={tables}
            collection={collection}
            currentStore={currentStore}
          />

        ))
      }

    </div>

  )

}

export default DashboardItemDetails
