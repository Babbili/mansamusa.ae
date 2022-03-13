import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import AppContext from '../../../components/AppContext'
import { firestore } from '../../../firebase/config'
import noProducts from '../../../assets/abc.jpg'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import DashboardFilters from '../../../components/UI/Dashboard/DashboardFilters/DashboardFilters'
import DashboardItem from '../../../components/UI/Dashboard/DashboardItem/DashboardItem'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardSumWidget from '../../../components/UI/Dashboard/DashboardSumWidget/DashboardSumWidget'
import { dateTime, stringFilter, topFilter } from '../../Admin/utility/utility'

import styles from './SupplierOrders.module.scss'


const SupplierOrders = ({ isTrial, approved, currentStore, isSubscribed }) => {

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    filters: [
      {
        title: {
          en: 'Filter by activity date',
          ar: 'تصفية المنتجات حسب التاريخ'
        },
        type: 'datetime',
        collection: 'stores',
        options: [
          {
            title: {
              en: 'Today',
              ar: 'اليوم'
            },
            selected: true,
            value: {
              startDate: moment().startOf('day').unix(),
              endDate: moment().endOf('day').unix()
            }
          },
          {
            title: {
              en: 'This week',
              ar: 'هذا الاسبوع'
            },
            selected: false,
            value: {
              startDate: moment().startOf('week').unix(),
              endDate: moment().endOf('week').unix()
            }
          },
          {
            title: {
              en: 'Custom Dates',
              ar: 'هذا الاسبوع'
            },
            type: 'await',
            selected: false,
            value: ''
          }
        ]
      },
      {
        title: {
          en: 'Filter by',
          ar: 'تصفية المنتجات حسب التاريخ'
        },
        type: 'string',
        options: [
          {
            title: {
              en: 'Name',
              ar: 'أي'
            },
            value: '',
            field: 'displayName',
            type: 'await'
          },
          {
            title: {
              en: 'Email',
              ar: 'أي'
            },
            value: '',
            field: 'email',
            type: 'await'
          },
          {
            title: {
              en: 'Phone number',
              ar: 'أي'
            },
            value: '',
            field: 'phoneNumber',
            type: 'await'
          }
        ]
      }
    ],
    currentFilters: [
      {
        filterGroupTitle: 'DashboardSum',
        filterGroupType: 'topFilter',
        optionTitle: '',
        optionValue: ''
      }
    ],
    items: [],
    isReady: false,
    lastVisible: [],
    isButton: true
  })

  // count all items
  useEffect(() => {
    return firestore.collectionGroup('supplierOrders')
    .where('storeId', '==', currentStore.id)
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          total: snapshot.size,
          isReady: true
        }
      })
    })
  }, [currentStore.id])

  // count delivered items
  useEffect(() => {
    return firestore.collectionGroup('supplierOrders')
    .where('storeId', '==', currentStore.id)
    .where('isDelivered', '==', true)
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          delivered: snapshot.size,
          isReady: true
        }
      })
    })
  }, [currentStore.id])

  // count cancelled items
  useEffect(() => {
    return firestore.collectionGroup('supplierOrders')
    .where('storeId', '==', currentStore.id)
    .where('isCanceled', '==', true)
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          cancelled: snapshot.size,
          isReady: true
        }
      })
    })
  }, [currentStore.id])

  // filter items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        isButton: true
      }
    })

    let initialQuery = firestore.collectionGroup('supplierOrders')
    .where('storeId', '==', currentStore.id)

    state.currentFilters.forEach(filter => {

      if (filter.filterGroupType === 'topFilter' && filter.optionValue.length !== 0) {
        initialQuery = topFilter(initialQuery, filter)
      }

      if (filter.filterGroupType === 'datetime') {
        initialQuery = dateTime(initialQuery, filter)
      }

      if (filter.filterGroupType === 'string') {
        initialQuery = stringFilter(initialQuery, filter)
      }

    })

    return initialQuery.limit(10)
    .onSnapshot(snapShot => {

      let documentData = snapShot.docs.map(document => {
        return {
          id: document.id,
          ...document.data()
        }
      })

      let lastVisible = snapShot.docs[snapShot.docs.length - 1]

      setState(prevState => {
        return {
          ...prevState,
          items: documentData,
          visibles: [lastVisible],
          isReady: true
        }
      })

    })

  }, [currentStore.id, state.currentFilters])

  const handleMore = async () => {

    try {

      setState({
        ...state,
        more: true
      })

      let initialQuery = firestore.collectionGroup('supplierOrders')
      .where('storeId', '==', currentStore.id)
      .startAfter(state.visibles[state.visibles.length - 1])
      .limit(10)

      state.currentFilters.forEach(filter => {

        if (filter.filterGroupType === 'topFilter' && filter.optionValue.length !== 0) {
          initialQuery = topFilter(initialQuery, filter)
        }

        if (filter.filterGroupType === 'datetime') {
          initialQuery = dateTime(initialQuery, filter)
        }

        if (filter.filterGroupType === 'string') {
          initialQuery = stringFilter(initialQuery, filter)
        }

      })

      let documentSnapshots = await initialQuery.get()

      let lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

      let documentData = documentSnapshots.docs.map(document => {
        return {
          id: document.id,
          ...document.data()
        }
      })

      if (documentData.length > 0) {
        setState({
          ...state,
          items: [...state.items, ...documentData],
          visibles: [...state.visibles, lastVisible],
          isReady: true
        })
      } else {
        setState({
          ...state,
          isReady: true,
          isButton: false
        })
      }

    } catch (err) {
      console.log(err)
    }


  }

  // handle filter with callback
  const handleFilters = async filter => {

    let isGroupExist = state.currentFilters
    .some(f => f.filterGroupTitle === filter.filterGroupTitle)

    let isGroupItemExist = state.currentFilters
    .some(f => f.filterGroupTitle === filter.filterGroupTitle &&
      f.optionTitle === filter.optionTitle &&
      f.optionValue === filter.optionValue)

    if (isGroupExist) {

      if (isGroupItemExist) {

        if (filter.type === 'await') {

          let filters = state.currentFilters
          .filter(f => f.filterGroupTitle !== filter.filterGroupTitle &&
            f.optionValue !== filter.optionValue)

          setState({
            ...state,
            currentFilters: [...filters, filter]
          })

        }

      } else {

        let filters = state.currentFilters
        .filter(f => f.filterGroupTitle !== filter.filterGroupTitle &&
          f.optionValue !== filter.optionValue)

        setState({
          ...state,
          currentFilters: [...filters, filter]
        })

      }

    } else {

      setState({
        ...state,
        currentFilters: [...state.currentFilters, filter]
      })

    }

  }

  const handleClear = (groupTitle, optionTitle) => {

    let currentFilters = state.currentFilters
    .filter(f => f.filterGroupTitle !== groupTitle && f.optionTitle.en !== optionTitle.en)

    setState({
      ...state,
      currentFilters
    })

  }

  const handleAccept = id => {

    firestore.collection('users').doc(currentUser.uid)
    .collection('supplierOrders').doc(id)
    .update({
      isAccepted: true
    })
    .then(() => {
      firestore.collectionGroup('orders')
      .where('orderId', '==', id)
      .onSnapshot(snap => {
        snap.forEach(doc => {
          firestore.doc(doc.ref.path)
          .update({
            isAccepted: true
          })
          .then(() => {})
        })
      })
    })

  }

  const handleReady = id => {

    firestore.collection('users').doc(currentUser.uid)
    .collection('supplierOrders').doc(id)
    .update({
      isReady: true
    })
    .then(() => {
      firestore.collectionGroup('orders')
      .where('orderId', '==', id)
      .onSnapshot(snap => {
        snap.forEach(doc => {
          firestore.doc(doc.ref.path)
          .update({
            isReady: true
          })
          .then(() => {})
        })
      })
    })

  }

  const schema = {
    collection: 'supplierOrders',
    condition: 'supplierOrders'
  }


  return(

    <>

      {
        !approved && !isTrial && !isSubscribed ?
          <Redirect
            to={'/supplier/stores'}
          /> :
          approved && isTrial && !isSubscribed ?
            null :
            approved && !isTrial && isSubscribed ?
              null :
              approved && !isTrial && !isSubscribed ?
                <Redirect
                  to={'/supplier/stores'}
                /> : null
      }

      <div className={styles.SupplierOrders}>

        <div
          className={styles.title}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          { t('myOrders.label') }
        </div>

        <div className='container-fluid'>

          <div className={`${styles.dashboard} row`}>

            <DashboardSumWidget
              title={'Total'}
              description={'Number of all orders'}
              number={state.total}
              optionTitle={''}
              optionValue={''}
              handleFilters={handleFilters}
              current={state.currentFilters}
            />

            <DashboardSumWidget
              title={'Delivered'}
              description={'Number of delivered orders'}
              number={state.delivered}
              optionTitle={'isDelivered'}
              optionValue={true}
              handleFilters={handleFilters}
              current={state.currentFilters}
            />

            <DashboardSumWidget
              title={'Cancelled'}
              description={'Number of cancelled orders'}
              number={state.cancelled}
              optionTitle={'isCanceled'}
              optionValue={true}
              handleFilters={handleFilters}
              current={state.currentFilters}
            />

          </div>

          <div className='row mt-4 mb-2'>

            <DashboardFilters
              filters={state.filters}
              handleClear={handleClear}
              current={state.currentFilters}
              handleFilters={handleFilters}
            />

          </div>

          <div className={`${styles.orders} row`}>
            {
              state.isReady ?
                state.items.map((item, index) => (
                  <DashboardItem
                    key={index}
                    item={item}
                    schema={schema}
                    handleReady={handleReady}
                    handleAccept={handleAccept}
                    notifications={state.notifications}
                    merchantId={currentStore.merchantId}
                  />
                )) :
                <div className='col-12 my-5'>
                  <BasicSpinner />
                </div>
            }
          </div>

          <div className='row mt-2 mb-2 justify-content-center'>

            {
              state.isButton ?
                state.items.length > 0 ?
                  <div className='col-lg-4 col-12 text-center'>
                    <SignUpButton
                      title={'Load More'}
                      type={'custom'}
                      onClick={handleMore}
                      disabled={false}
                      isWide={true}
                    />
                  </div> :
                      <div className='col-lg-4 col-12 text-center mt-5'>
                      <h5>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M14.829 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.042 6.042 0 0 0 2.415 0 5.972 5.972 0 0 0 2.148-.903c.313-.212.612-.458.886-.731.272-.271.52-.571.734-.889l-1.658-1.119a4.017 4.017 0 0 1-.489.592z"></path><circle cx="8.5" cy="10.5" r="1.5"></circle><circle cx="15.493" cy="10.493" r="1.493"></circle></svg> No data to show
                      </h5>
                    </div> :
                  <div className='col-lg-4 col-12 text-center mt-5'>
                    <h5>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M14.829 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.042 6.042 0 0 0 2.415 0 5.972 5.972 0 0 0 2.148-.903c.313-.212.612-.458.886-.731.272-.271.52-.571.734-.889l-1.658-1.119a4.017 4.017 0 0 1-.489.592z"></path><circle cx="8.5" cy="10.5" r="1.5"></circle><circle cx="15.493" cy="10.493" r="1.493"></circle></svg> All data loaded
                    </h5>
                  </div>
            }

          </div>

        </div>

      </div>

      {/* {
        state.total > 0 ? null :
          <div className={`${styles.emptyData}`}>
            <div className='col-12 text-center'>
              <img src={noProducts} alt={'Nothing Here Yet'} />
              <h3>
                { t('yourOrdersWillShowHere.label') }
              </h3>
              <div className={styles.description}>
                { t('yourOrdersWillBeShownHere.label') }
              </div>
            </div>
          </div>
      } */}

    </>

  )

}

export default SupplierOrders
