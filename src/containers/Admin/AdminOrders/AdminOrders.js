import React, { useContext, useEffect, useState } from 'react'
import AppContext from "../../../components/AppContext"

import styles from './AdminOrders.module.scss'
// import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { firestore } from '../../../firebase/config';
import { dateTime, stringFilter, topFilter } from '../utility/utility';
import DashboardSumWidget from '../../../components/UI/Dashboard/DashboardSumWidget/DashboardSumWidget';
import DashboardFilters from '../../../components/UI/Dashboard/DashboardFilters/DashboardFilters';
import DashboardItem from '../../../components/UI/Dashboard/DashboardItem/DashboardItem';
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner';
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AdminOrders = props => {

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  // let { t } = useTranslation()

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
    return firestore.collectionGroup('orders')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          total: snapshot.size,
          isReady: true
        }
      })
    })
  }, [currentUser])

  // count delivered items
  useEffect(() => {
    return firestore.collectionGroup('orders')
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
  }, [currentUser])

  // count pending  items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        pending: prevState.total - prevState.delivered
      }
    })

  }, [state.total, state.delivered])

  // filter items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        isButton: true
      }
    })

    let initialQuery = firestore
    .collectionGroup('orders')

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

    return initialQuery.limit(2)
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

  }, [currentUser, state.currentFilters])

  const handleMore = async () => {

    try {

      setState({
        ...state,
        more: true
      })

      let initialQuery = firestore.collectionGroup('orders')
      .startAfter(state.visibles[state.visibles.length - 1])
      .limit(2)

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

  const schema = {
    collection: 'adminOrders',
    condition: 'adminOrders'
  }


  return(

    <>

      <div className={styles.AdminOrders}>
        <div
          className={styles.title}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          Orders
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
              title={'Pending'}
              description={'Number of pending orders'}
              number={state.pending}
              optionTitle={'isDelivered'}
              optionValue={false}
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
                    notifications={state.notifications}
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
                      disabled={false}
                      title={'Load More'}
                      type={'custom'}
                      onClick={handleMore}
                    />
                  </div> :
                  <div className='col-lg-4 col-12 text-center mt-5'>
                    <h5>
                      <FontAwesomeIcon icon={'smile'} /> No data to show
                    </h5>
                  </div> :
                <div className='col-lg-4 col-12 text-center mt-5'>
                  <h5>
                    <FontAwesomeIcon icon={'smile'} /> All data loaded
                  </h5>
                </div>
            }

          </div>

        </div>

      </div>

    </>

  )

}

export default AdminOrders
