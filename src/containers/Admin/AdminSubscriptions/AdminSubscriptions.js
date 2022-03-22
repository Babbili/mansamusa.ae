import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { firestore } from '../../../firebase/config'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import moment from 'moment'
import { dateTime, stringFilter, topFilter } from '../utility/utility'
import DashboardSumWidget from '../../../components/UI/Dashboard/DashboardSumWidget/DashboardSumWidget'
import DashboardFilters from '../../../components/UI/Dashboard/DashboardFilters/DashboardFilters'
import DashboardItem from '../../../components/UI/Dashboard/DashboardItem/DashboardItem'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { scrollToTop } from '../../../utils/utils'

import styles from './AdminSubscriptions.module.scss'


const AdminSubscriptions = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [state, setState] = useState({
    total: 0,
    approved: 0,
    disapproved: 0,
    filters: [
      {
        title: {
          en: 'Filter by created date',
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
        type: 'map',
        collection: 'stores',
        options: [
          {
            title: {
              en: 'Store Name',
              ar: 'أي'
            },
            value: '',
            field: 'store',
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
  const [isUnsubscribe, setIsUnsubscribe] = useState(false)
  const [isError, setIsError] = useState(false)

  // count all items
  useEffect(() => {
    return firestore.collection('subscriptions')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          total: snapshot.size,
          isReady: true
        }
      })
    })
  }, [])

  // count active items
  useEffect(() => {
    return firestore.collection('subscriptions')
    .where('status', '==', 'ACTI')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          active: snapshot.size
        }
      })
    })
  }, [])

  // count canceled items
  useEffect(() => {
    return firestore.collection('subscriptions')
    .where('status', '==', 'CANC')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          canceled: snapshot.size
        }
      })
    })
  }, [])

  // count expired items
  useEffect(() => {
    return firestore.collection('subscriptions')
    .where('status', '==', 'EXPD')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          expired: snapshot.size
        }
      })
    })
  }, [])

  // count inactive items
  useEffect(() => {
    return firestore.collection('subscriptions')
    .where('status', '==', 'INAC')
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          inactive: snapshot.size
        }
      })
    })
  }, [])

  // filter items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        isButton: true
      }
    })

    let initialQuery = firestore.collection('subscriptions')

    state.currentFilters.forEach(filter => {

      if (filter.filterGroupType === 'topFilter' && filter.optionValue.length !== 0) {
        initialQuery = topFilter(initialQuery, filter)
      }

      if (filter.filterGroupType === 'datetime') {
        initialQuery = dateTime(initialQuery, filter)
      }

      if (filter.filterGroupType === 'string' || filter.filterGroupType === 'map') {
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

  }, [state.currentFilters])

  const handleMore = async () => {

    try {

      setState({
        ...state,
        more: true
      })

      let initialQuery = firestore.collection('subscriptions')
      .startAfter(state.visibles[state.visibles.length - 1])
      .limit(10)

      state.currentFilters.forEach(filter => {

        if (filter.filterGroupType === 'topFilter' && filter.optionValue.length !== 0) {
          initialQuery = topFilter(initialQuery, filter)
        }

        if (filter.filterGroupType === 'datetime') {
          initialQuery = dateTime(initialQuery, filter)
        }

        if (filter.filterGroupType === 'string' || filter.filterGroupType === 'map') {
          initialQuery = stringFilter(initialQuery, filter)
        }

      })

      // initialQuery.limit(1)

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

  const handleCancelSubscription = async (id) => {

    let url = 'https://mansamusa.ae/subscription-cancel'

    setIsUnsubscribe(true)

    await axios.post(url, {
      si_sub_ref_no: id
    })
    .then(r => {

      if (r.data.si_cancel_status === 0) {

        scrollToTop(0, 'smooth')
        setIsUnsubscribe(false)

      } else {

        setIsError(true)
        setIsUnsubscribe(false)

        setTimeout(() => {
          setIsError(false)
        }, 2500)

      }

    })
    .catch(e => {
      console.log('error', e)
      setIsUnsubscribe(false)
    })

  }

  const schema = {
    collection: 'subscriptions',
    condition: 'subscriptions'
  }


  return(

    <div className={styles.AdminSubscriptions}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Subscriptions
      </div>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          <DashboardSumWidget
            title={'Total'}
            description={'Number of all subscriptions'}
            number={state.total}
            optionTitle={''}
            optionValue={''}
            handleFilters={handleFilters}
            current={state.currentFilters}
          />

          <DashboardSumWidget
            title={'Active'}
            description={'All active subscriptions'}
            number={state.active}
            optionTitle={'status'}
            optionValue={'ACTI'}
            handleFilters={handleFilters}
            current={state.currentFilters}
          />

          <DashboardSumWidget
            title={'Canceled'}
            description={'All canceled subscriptions'}
            number={state.canceled}
            optionTitle={'status'}
            optionValue={'CANC'}
            handleFilters={handleFilters}
            current={state.currentFilters}
          />

          <DashboardSumWidget
            title={'Inactive'}
            description={'All inactive subscriptions'}
            number={state.inactive}
            optionTitle={'status'}
            optionValue={'INAC'}
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

        <div className={`${styles.subscriptions} row`}>
          {
            state.isReady ?
              state.items.map((item, index) => (
                <DashboardItem
                  key={index}
                  item={item}
                  schema={schema}
                  isError={isError}
                  isUnsubscribe={isUnsubscribe}
                  notifications={state.notifications}
                  handleCancelSubscription={handleCancelSubscription}
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

  )

}

export default AdminSubscriptions
