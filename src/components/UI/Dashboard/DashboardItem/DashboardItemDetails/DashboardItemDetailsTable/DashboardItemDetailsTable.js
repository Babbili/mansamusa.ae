import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../../AppContext'
import { firestore } from '../../../../../../firebase/config'
import DashboardItemDetailsTableItem from './DashboardItemDetailsTableItem/DashboardItemDetailsTableItem'
import DashboardItemDetailsTableHeader from './DashboardItemDetailsTableHeader/DashboardItemDetailsTableHeader'
// import DashboardFilters from "../../../DashboardFilters/DashboardFilters";

import styles from './DashboardItemDetailsTable.module.scss'
import axios from 'axios'
import moment from 'moment'


const DashboardItemDetailsTable = ({ item, index, table, tables, collection, currentStore }) => {

  const context = useContext(AppContext)
  let { lang } = context

  // const [state, setState] = useState({
  //   filters: [
  //     {
  //       type: {
  //         en: 'Filter orders by',
  //         ar: 'تصفية المنتجات حسب التاريخ'
  //       },
  //       options: [
  //         {
  //           title: {
  //             en: 'Delivered',
  //             ar: 'اليوم'
  //           },
  //           selected: true,
  //           value: 'Delivered'
  //         },
  //         {
  //           title: {
  //             en: 'Processing',
  //             ar: 'اليوم'
  //           },
  //           selected: false,
  //           value: 'Processing'
  //         },
  //         {
  //           title: {
  //             en: 'Cancelled',
  //             ar: 'اليوم'
  //           },
  //           selected: false,
  //           value: 'Cancelled'
  //         }
  //       ]
  //     }
  //   ],
  // })

  const [state, setState] = useState({
    filters: [],
    currentFilter: [],
    items: [],
    isLoading: false,
    delivery: {}
  })

  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const [isPlaced, setIsPlaced] = useState(false)

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false)
        setError('')
      }, 2500)
    }
  }, [isError])

  useEffect(() => {

    if (collection === 'stores') {

      if (table.collection === 'storeAddress') {

        setState(prevState => {
          return {
            ...prevState,
            items: item.address
          }
        })

      } else if (table.collection === 'storeDocuments') {

        setState(prevState => {
          return {
            ...prevState,
            items: {...item.vat, ...item.store}
          }
        })

      } else if (table.collection === 'storeDescription') {

        setState(prevState => {
          return {
            ...prevState,
            items: item
          }
        })

      } else if (table.collection === 'storeInformation') {

        let getUserData = async () => {

          let userId = await firestore.collectionGroup('stores')
          .where('id', '==', item.id)
          .get()
          .then(snap => {
            let uid = ''
            snap.forEach(doc => {
              uid = doc.ref.path.split('/')[1].toString()
            })
            return uid
          })

          return firestore.collection('users')
          .doc(userId)
          .get()
          .then(doc => {
            return doc.data()
          })

        }

        getUserData()
        .then(data => {
          setState(prevState => {
            return {
              ...prevState,
              items: {...item, ...data}
            }
          })
        })

      } else if (table.collection === 'products') {

        return firestore.collection('products')
        .where('store', '==', item.id)
        .limit(10)
        .onSnapshot(snapshot => {
          let items = []
          snapshot.forEach(doc => {
            items = [...items, {id: doc.id, ...doc.data()}]
          })
          setState(prevState => {
            return {
              ...prevState,
              items
            }
          })
        })

      }

    } else if (collection === 'customerOrders' || collection === 'adminOrders') {

      if (table.collection === 'ordersProducts') {

        return firestore.collectionGroup('supplierOrders')
        .where('orderId', '==', item.id)
        .where('storeId', '==', table.id)
        .onSnapshot(snapshot => {
          let items = []
          snapshot.forEach(doc => {
            items = [...items, ...doc.data().items]
          })
          setState(prevState => {
            return {
              ...prevState,
              items
            }
          })
        })

      }

    } else if (collection === 'supplierOrders') {

      if (table.collection === 'ordersProducts') {

        setState(prevState => {
          return {
            ...prevState,
            items: item.items
          }
        })

      } else if (table.collection === 'deliveryAddress') {

        setState(prevState => {
          return {
            ...prevState,
            items: item.deliveryAddress
          }
        })

      } else if (table.collection === 'customerNote') {

        setState(prevState => {
          return {
            ...prevState,
            items: item.deliveryAddress
          }
        })

      } else if (table.collection === 'customerInformation') {

        setState(prevState => {
          return {
            ...prevState,
            items: item.user
          }
        })

      }

    } else if (collection === 'abandonedWishlists') {

      setState(prevState => {
        return {
          ...prevState,
          items: item.items.filter(f => f.store === currentStore)
        }
      })

    } else if (collection === 'abandonedCarts') {

      setState(prevState => {
        return {
          ...prevState,
          items: item.items.filter(f => f.store === currentStore)
        }
      })

    } else if (collection === 'subscriptions') {

      let url = 'https://mansamusa.ae/subscription-charges'

      setState(prevState => {
        return {
          ...prevState,
          isLoading: true
        }
      })

      axios.post(url, {
        "si_sub_ref_no": item.subscriptionNumber
      })
      .then(r => {
        setState(prevState => {
          return {
            ...prevState,
            items: r.data.si_Charge_List_Result !== undefined ? r.data.si_Charge_List_Result : [],
            isLoading: false
          }
        })
      })

    } else if (collection === 'adminAbandonedCarts') {

      setState(prevState => {
        return {
          ...prevState,
          items: item.items.filter(f => f.store === table.title)
        }
      })

    } else if (collection === 'adminAbandonedWishlists') {

      setState(prevState => {
        return {
          ...prevState,
          items: item.items.filter(f => f.store === table.id)
        }
      })

    } else {

      return firestore.collection(collection).doc(item.id)
      .collection(table.collection)
      .limit(10)
      .onSnapshot(snapshot => {
        let items = []
        snapshot.forEach(doc => {
          items = [...items, {id: doc.id, ...doc.data()}]
        })
        setState(prevState => {
          return {
            ...prevState,
            items
          }
        })
      })

    }

  }, [item, table, collection, currentStore])

  // check for delivery
  useEffect(() => {

    if (collection === 'customerOrders' && item.isDeliveryPlaced) {
      firestore.collectionGroup('supplierOrders')
      .where('orderId', '==', item.orderId)
      .where('storeName', '==', table.title)
      .where('isDeliveryPlaced', '==', true)
      .onSnapshot(snap => {
        let delivery = {}
        snap.forEach(doc => {
          delivery = {
            deliveryId: doc.data().deliveryId,
            deliveryTime: doc.data().deliveryTime,
            pickupTime: doc.data().pickupTime,
            ...doc.data()
          }
        })
        setState(prevState => {
          return {
            ...prevState,
            delivery
          }
        })
      })
    }

  }, [collection, table.title, item.orderId, item.isDeliveryPlaced])

  const handleCancelDelivery = async id => {

    setIsPlaced(true)

    let data = {
      id: id
    }

    await axios.post('https://mansamusa.ae/delivery/cancel', data)
    .then(res => {
      console.log('res', res.data)
      if (res.data.status === 'success') {
        setIsPlaced(false)
      } else {
        setIsError(true)
        setIsPlaced(false)
        setError(res.data.error)
      }
    })

  }


  return(

    state.items.length > 0 || Object.values(state.items).length > 0 ?
      <>
        <div className={`row ${tables.length - 1 !== index || item.isDeliveryPlaced ? 'mb-4' : ''}`}>

          <div className='col-12'>

            <div className={styles.DashboardItemDetailsTable}>

              <div className={styles.header}>

                <div className={styles.title}>
                  { table.title }
                </div>

                {/*<DashboardFilters*/}
                {/*  filters={state.filters}*/}
                {/*  // handleClear={handleClear}*/}
                {/*  // handleFilterDates={handleFilterDates}*/}
                {/*/>*/}

              </div>

              <div className={styles.orders}>

                <table>

                  <DashboardItemDetailsTableHeader
                    lang={lang}
                    items={state.items}
                    schema={table.schema}
                  />

                  <tbody>

                  {
                    Array.isArray(state.items) ?
                      state.items.map((item, index) => {
                        return(

                          <DashboardItemDetailsTableItem
                            lang={lang}
                            key={index}
                            item={item}
                            items={state.items}
                            schema={table.schema}
                          />

                        )

                      }) :
                      [state.items].map((item, index) => {

                        return(

                          <DashboardItemDetailsTableItem
                            lang={lang}
                            key={index}
                            item={item}
                            items={state.items}
                            schema={table.schema}
                          />

                        )

                      })
                  }

                  </tbody>

                </table>

                {
                  state.items > 0 ?
                    <div className={styles.loadMore}>
                      <span>Load more</span>
                    </div> : null
                }

              </div>

            </div>

          </div>

        </div>

        {
          collection === 'customerOrders' && Object.values(state.delivery).length > 0 ?
          <div className={`row ${tables.length - 1 !== index ? 'mb-4' : ''}`}>

            <div className='col-12'>

              <div className={styles.DashboardItemDetailsTable}>

                <div className={styles.header}>

                  <div className={styles.title}>
                    {
                      state.delivery.isCanceled ?
                        'Delivery #' + state.delivery.deliveryId + ' has been canceled'  : 'Order #' + state.delivery.deliveryId
                    }
                  </div>

                </div>

                <div className={styles.orders}>

                  {
                    state.delivery.isCanceled ?
                      <div className='row'>

                        <div className='col-12'>
                          <div className={styles.deliveryBox}>
                            <div className={styles.attention}>
                              You've cancelled delivery from { table.title } store.
                            </div>
                          </div>
                        </div>

                      </div> :
                      <div className='row'>

                        <div className='col-lg-8 col-12'>
                          <div className={styles.deliveryBox}>
                            <div className={styles.attention}>
                              Your order from { table.title } store will be delivered on&nbsp;
                              { moment.unix(state.delivery.deliveryTime/1000).format('LLLL') }.&nbsp;
                              We are using an Ahoy Services for all our deliveries.&nbsp;
                              Please check for <a href={'https://mansamusa.ae/assets/deliveryPolicy.pdf'} target='_blank' rel='noopener noreferrer' >Ahoy Delivery Policy.</a>
                            </div>
                          </div>
                        </div>

                        <div className='col-lg-4 col-12 align-content-center d-flex justify-content-end'>
                          {
                            isError ?
                              error :
                              <div className={styles.btnWrapper}>
                                <div
                                  className={styles.btn}
                                  onClick={() => handleCancelDelivery(state.delivery.deliveryId)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                                  <span>
                                  {
                                    isPlaced ?
                                      'Cancelling delivery...' : 'Cancel Delivery'
                                  }
                              </span>
                                </div>
                              </div>
                          }
                        </div>

                      </div>
                  }

                </div>

              </div>

            </div>

          </div> : null
        }

      </> :
      state.isLoading ?
      <div className='row'>
        <div className='col-12'>
          Loading Information
        </div>
      </div> : null

  )

}

export default DashboardItemDetailsTable
