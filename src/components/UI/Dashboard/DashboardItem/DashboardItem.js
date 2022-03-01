import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import AppContext from '../../../../components/AppContext'
import Separator from '../../../../components/UI/Separator/Separator'
import DashboardItemDetails from './DashboardItemDetails/DashboardItemDetails'
import DashboardItemUsers from './DashboardItemUsers/DashboardItemUsers'
import DashboardItemStore from './DashboardItemStore/DashboardItemStore'
import DashboardItemOrder from './DashboardItemOrder/DashboardItemOrder'
import DashboardItemSupplierOrder from './DashboardItemSupplierOrder/DashboardItemSupplierOrder'
import DashboardItemSupplierAbandoned from './DashboardItemSupplierAbandoned/DashboardItemSupplierAbandoned'
import DashboardItemAdminSubscription from './DashboardItemAdminSubscription/DashboardItemAdminSubscription'
import DashboardItemAdminOrder from './DashboardItemAdminOrder/DashboardItemAdminOrder'

import styles from './DashboardItem.module.scss'


const DashboardItem = ({
  item,
  schema,
  merchantId,
  handleReady,
  handleAccept,
  currentStore,
  isUnsubscribe,
  handleApprove,
  handleSpecialApprove,
  handleCancelSubscription
}) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { collection, condition } = schema

  const [state, setState] = useState({
    data: null,
    isToggle: false,
    tables: []
  })

  // get schemas
  useEffect(() => {

    if (condition === 'customer') {

      return setState(prevState => {

        return {
          ...prevState,
          tables: [
            {
              title: 'Latest Orders',
              collection: 'orders',
              schema: [
                {
                  title: 'Order #',
                  field: 'orderId'
                },
                {
                  title: 'Date',
                  field: 'createdAt',
                  type: 'timestamp'
                },
                {
                  title: 'Payment',
                  field: 'total'
                },
                {
                  title: 'Delivery Fee',
                  field: 'delivery'
                },
                {
                  title: 'Payed',
                  field: 'isPayed'
                },
                {
                  title: 'Accepted',
                  field: 'isAccepted'
                },
                {
                  title: 'Delivered',
                  field: 'isDelivered'
                }
              ]
            },
            // {
            //   title: 'Payment Methods',
            //   collection: 'paymentMethods',
            //   schema: []
            // },
            {
              title: 'Personal Information',
              collection: 'profile',
              schema: [
                {
                  title: 'Location',
                  field: 'location'
                },
                {
                  title: 'City',
                  field: 'city'
                },
                {
                  title: 'Street',
                  field: 'streetName'
                },
                {
                  title: 'Building Name or #',
                  field: 'buildingName'
                },
                {
                  title: 'Floor Number',
                  field: 'floorNumber'
                },
                {
                  title: 'Flat Number',
                  field: 'flatNumber'
                }
              ]
            }
          ]
        }

      })

    } else if (condition === 'supplier') {

      return setState(prevState => {

        return {
          ...prevState,
          tables: [
            {
              title: 'Latest Orders',
              collection: 'orders',
              schema: [
                {
                  title: 'Order #',
                  field: 'id'
                },
                {
                  title: 'Transaction #',
                  field: 'transactionId'
                },
                {
                  title: 'Date',
                  field: 'createdAt',
                  type: 'timestamp'
                },
                {
                  title: 'Payment',
                  field: 'totalPayment'
                },
                {
                  title: 'Delivery Fee',
                  field: 'deliveryFee'
                },
                {
                  title: 'Status',
                  field: 'status'
                }
              ]
            },
            {
              title: 'Stores',
              collection: 'stores',
              schema: [
                {
                  title: 'Store Name/Brand',
                  field: 'storeName'
                },
                {
                  title: 'Category',
                  field: 'product'
                },
                {
                  title: 'Created',
                  field: 'createdAt',
                  type: 'timestamp'
                },
                {
                  title: 'Company Name',
                  field: 'companyName'
                },
                {
                  title: 'Company Address',
                  field: 'companyAddress'
                },
                {
                  title: 'Approved',
                  field: 'approved'
                }
              ]
            },
            {
              title: 'Personal Information',
              collection: 'profile',
              schema: [
                {
                  title: 'Location',
                  field: 'location'
                },
                {
                  title: 'City',
                  field: 'city'
                },
                {
                  title: 'Street',
                  field: 'streetName'
                },
                {
                  title: 'Building Name or #',
                  field: 'buildingName'
                },
                {
                  title: 'Floor Number',
                  field: 'floorNumber'
                },
                {
                  title: 'Flat Number',
                  field: 'flatNumber'
                }
              ]
            }
          ]
        }

      })

    } else if (condition === 'stores') {

      return setState(prevState => {
        return {
          ...prevState,
          tables: [
            {
              title: 'Information',
              collection: 'storeInformation',
              schema: [
                {
                  title: 'Company Name',
                  field: 'companyName'
                },
                {
                  title: 'Company Phone',
                  field: 'companyPhone',
                },
                {
                  title: 'Owner',
                  field: 'displayName'
                },
                {
                  title: 'Owner Phone',
                  field: 'phoneNumber'
                },
                {
                  title: 'Owner Email',
                  field: 'email'
                }
              ]
            },
            {
              title: 'Documents & Licenses',
              collection: 'storeDocuments',
              schema: [
                {
                  title: 'National Id',
                  field: 'nationalId',
                  type: 'url'
                },
                {
                  title: 'Trade License',
                  field: 'tradeLicense',
                  type: 'url'
                },
                {
                  title: 'Tax Reg. Certificate',
                  field: 'taxRegCertificate',
                  type: 'url'
                },
                {
                  title: 'Tax Reg. Number',
                  field: 'taxRegNumber'
                }
              ]
            },
            {
              title: 'Address',
              collection: 'storeAddress',
              schema: [
                {
                  title: 'Country',
                  field: 'country'
                },
                {
                  title: 'City',
                  field: 'city'
                },
                {
                  title: 'Area',
                  field: 'area'
                },
                {
                  title: 'Full Address',
                  field: 'customerAddress'
                },
                {
                  title: 'Building',
                  field: 'building'
                },
                {
                  title: 'Floor',
                  field: 'floor'
                },
                {
                  title: 'Unit',
                  field: 'unit'
                }
              ]
            },
            {
              title: 'About',
              collection: 'storeDescription',
              schema: [
                {
                  title: 'Description',
                  field: 'storeDescription'
                }
              ]
            },
            {
              title: 'Products',
              collection: 'products',
              schema: [
                {
                  title: 'Product Name',
                  field: 'productName'
                },
                {
                  title: 'Created',
                  field: 'createdAt',
                  type: 'timestamp'
                },
                {
                  title: 'Price',
                  field: 'productPrice'
                },
                {
                  title: 'Quantity',
                  field: 'productQuantity'
                },
                {
                  title: 'Status',
                  field: 'status'
                },
                {
                  title: 'Approved',
                  field: 'isApproved',
                  type: 'boolean'
                }
              ]
            }
          ]
        }
      })

    } else if (condition === 'supplierOrders') {

      return setState(prevState => {
        return {
          ...prevState,
          tables: [
            {
              title: 'Products in Order',
              collection: 'ordersProducts',
              schema: [
                {
                  title: 'Product Name',
                  field: 'name'
                },
                {
                  title: 'Options',
                  field: 'options',
                  type: 'map'
                },
                {
                  title: 'Price',
                  field: 'price'
                },
                {
                  title: 'Quantity',
                  field: 'quantity'
                }
              ]
            },
            {
              title: 'Customer Note',
              collection: 'customerNote',
              schema: [
                {
                  title: 'Customer Note',
                  field: 'customerAddressNote'
                }
              ]
            },
            // {
            //   title: 'Delivery Address',
            //   collection: 'deliveryAddress',
            //   schema: [
            //     {
            //       title: 'Building',
            //       field: 'building'
            //     },
            //     {
            //       title: 'Floor',
            //       field: 'floor'
            //     },
            //     {
            //       title: 'Unit',
            //       field: 'unit'
            //     },
            //     {
            //       title: 'Address',
            //       field: 'customerAddress'
            //     },
            //     {
            //       title: 'Delivery Date',
            //       field: 'deliveryDate',
            //       type: 'timestamp'
            //     }
            //   ]
            // },
            // {
            //   title: 'Customer Information',
            //   collection: 'customerInformation',
            //   schema: [
            //     {
            //       title: 'First Name',
            //       field: 'firstName'
            //     },
            //     {
            //       title: 'Last Name',
            //       field: 'lastName'
            //     },
            //     {
            //       title: 'Phone',
            //       field: 'phone'
            //     },
            //     {
            //       title: 'Email',
            //       field: 'email'
            //     }
            //   ]
            // }
          ]
        }
      })

    } else if (condition === 'customerOrders' || condition === 'adminOrders') {

      // map deliveries
      return firestore.collectionGroup('supplierOrders')
      .where('orderId', '==', item.id)
      .onSnapshot(snapshot => {
        let tables = []
        snapshot.forEach(doc => {

          let temp = {
            title: doc.data().storeName,
            id: doc.data().storeId,
            collection: 'ordersProducts',
            schema: [
              {
                title: 'Product Name',
                field: 'name'
              },
              {
                title: 'Options',
                field: 'options',
                type: 'map'
              },
              {
                title: 'Price',
                field: 'price'
              },
              {
                title: 'Quantity',
                field: 'quantity'
              }
            ]
          }

          tables = [...tables, {...temp}]

        })
        setState(prevState => {
          return {
            ...prevState,
            tables
          }
        })
      })
      // return setState(prevState => {
      //   return {
      //     ...prevState,
      //     tables: [
      //       {
      //         title: 'Products in Order',
      //         collection: 'ordersProducts',
      //         schema: [
      //           {
      //             title: 'Product Name',
      //             field: 'name'
      //           },
      //           {
      //             title: 'Options',
      //             field: 'options',
      //             type: 'map'
      //           },
      //           {
      //             title: 'Price',
      //             field: 'price'
      //           },
      //           {
      //             title: 'Quantity',
      //             field: 'quantity'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // })

    } else if (condition === 'abandonedWishlists') {

      return setState(prevState => {
        return {
          ...prevState,
          tables: [
            {
              title: 'Your Products in Wishlist',
              collection: 'abandonedWishlists',
              schema: [
                {
                  title: 'Product Name',
                  field: 'productName'
                },
                {
                  title: 'Price',
                  field: 'productPrice'
                }
              ]
            }
          ]
        }
      })

    } else if (condition === 'abandonedCarts') {

      return setState(prevState => {
        return {
          ...prevState,
          tables: [
            {
              title: 'Your Products in Carts',
              collection: 'abandonedCarts',
              schema: [
                {
                  title: 'Product Name',
                  field: 'name'
                },
                {
                  title: 'Options',
                  field: 'options',
                  type: 'map'
                },
                {
                  title: 'Price',
                  field: 'price'
                },
                {
                  title: 'Quantity',
                  field: 'quantity'
                }
              ]
            }
          ]
        }
      })

    } else if (condition === 'adminAbandonedCarts') {

      // map items to stores

      let tables = []

      item.items.map(m => {

        let temp = {
          title: m.store,
          id: m.store,
          collection: 'abandonedProducts',
          schema: [
            {
              title: 'Product Name',
              field: 'name'
            },
            {
              title: 'Options',
              field: 'options',
              type: 'map'
            },
            {
              title: 'Price',
              field: 'price'
            },
            {
              title: 'Quantity',
              field: 'quantity'
            }
          ]
        }

        tables = [...tables, {...temp}]

        return m

      })

      return setState(prevState => {
        return {
          ...prevState,
          tables
        }
      })

    } else if (condition === 'adminAbandonedWishlists') {

      // map items to stores

      let tables = []

      item.items.map(m => {

        let temp = {
          title: m.storeName,
          id: m.store,
          collection: 'abandonedProducts',
          schema: [
            {
              title: 'Product Name',
              field: 'productName'
            },
            {
              title: 'Price',
              field: 'productPrice'
            }
          ]
        }

        tables = [...tables, {...temp}]

        return m

      })

      return setState(prevState => {
        return {
          ...prevState,
          tables
        }
      })

    } else if (condition === 'subscriptions') {

      return setState(prevState => {
        return {
          ...prevState,
          tables: [
            {
              title: 'Transactions',
              collection: 'subscriptions',
              schema: [
                {
                  title: 'Payment ID',
                  field: 'pay_id'
                },
                {
                  title: 'Date',
                  field: 'pay_date',
                },
                {
                  title: 'Status',
                  field: 'charge_status'
                },
                {
                  title: 'Card',
                  field: 'card_suffix'
                },
                {
                  title: 'Amount',
                  field: 'si_amount'
                },
                {
                  title: 'Currency',
                  field: 'si_currency'
                }
              ]
            }
          ]
        }
      })

    }

  }, [item.id, condition, item.items])

  // get data
  useEffect(() => {

    if (collection === 'users') {

      let initialQuery = firestore.collection(collection).doc(item.id)

      initialQuery.collection('profile')
      .onSnapshot(snapshot => {
        let temp = {}
        snapshot.forEach(doc => {
          temp = doc.data()
        })
        setState(prevState => {
          return {
            ...prevState,
            data: temp
          }
        })
      })

      return initialQuery

    } else if (collection === 'abandonedWishlists') {

      setState(prevState => {
        return {
          ...prevState,
          data: {
            ...item,
            items: item.items.filter(f => f.store === currentStore)
          }
        }
      })

    } else if (collection === 'abandonedCarts') {

      setState(prevState => {
        return {
          ...prevState,
          data: {
            ...item,
            items: item.items.filter(f => f.store === currentStore)
          }
        }
      })

    } else {

      setState(prevState => {
        return {
          ...prevState,
          data: item
        }
      })

    }

  }, [collection, item, schema, currentStore])

  const handleToggle = index => {
    setState({
      ...state,
      isToggle: !state.isToggle
    })
  }


  return(

    <div className={`${styles.DashboardItem} col-12 mb-4`}>

      {
        state.data !== null ?
          <div className={styles.wrapper}>

            {
              collection === 'users' ?
                <DashboardItemUsers
                  schema={schema}
                  item={item}
                  state={state}
                  handleToggle={handleToggle}
                /> :
                collection === 'customerOrders' ?
                  <DashboardItemOrder
                    item={state.data}
                    isToggle={state.isToggle}
                    handleToggle={handleToggle}
                    handleApprove={handleApprove}
                  /> :
                  collection === 'supplierOrders' ?
                    <DashboardItemSupplierOrder
                      item={state.data}
                      isToggle={state.isToggle}
                      handleReady={handleReady}
                      handleAccept={handleAccept}
                      handleToggle={handleToggle}
                    /> :
                    collection === 'adminOrders' ?
                      <DashboardItemAdminOrder
                        item={state.data}
                        isToggle={state.isToggle}
                        handleReady={handleReady}
                        handleAccept={handleAccept}
                        handleToggle={handleToggle}
                      /> :
                      collection === 'abandonedWishlists' ||
                      collection === 'abandonedCarts' ||
                      collection === 'adminAbandonedCarts' ||
                      collection === 'adminAbandonedWishlists' ?
                        <DashboardItemSupplierAbandoned
                          item={state.data}
                          isToggle={state.isToggle}
                          handleToggle={handleToggle}
                        /> :
                        collection === 'subscriptions' ?
                          <DashboardItemAdminSubscription
                            item={state.data}
                            isToggle={state.isToggle}
                            handleToggle={handleToggle}
                            isUnsubscribe={isUnsubscribe}
                            handleCancelSubscription={handleCancelSubscription}
                          /> :
                          <DashboardItemStore
                            item={state.data}
                            isToggle={state.isToggle}
                            handleToggle={handleToggle}
                            handleApprove={handleApprove}
                            handleSpecialApprove={handleSpecialApprove}
                          />
            }

            {
              state.isToggle ?
                <Separator color={'#ccc'} /> : null
            }

            {
              state.isToggle ?
                <div className={styles.view}>

                  <div className={styles.dashboard}>

                    <div className={`${styles.details} row`}>

                      <DashboardItemDetails
                        lang={lang}
                        item={item}
                        tables={state.tables}
                        collection={collection}
                        merchantId={merchantId}
                        currentStore={currentStore}
                      />

                    </div>

                  </div>

                </div> : null
            }

          </div> : null
      }

    </div>

  )

}

export default DashboardItem
