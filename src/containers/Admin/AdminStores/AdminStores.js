import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { firestore } from '../../../firebase/config'
import moment from 'moment'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import DashboardSumWidget from '../../../components/UI/Dashboard/DashboardSumWidget/DashboardSumWidget'
import DashboardFilters from '../../../components/UI/Dashboard/DashboardFilters/DashboardFilters'
import DashboardItem from '../../../components/UI/Dashboard/DashboardItem/DashboardItem'
import { topFilter, dateTime, stringFilter } from '../utility/utility'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AdminStores.module.scss'


const AdminStores = props => {

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
            field: 'storeName',
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
    return firestore.collectionGroup('stores')
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

  // count approved items
  useEffect(() => {
    return firestore.collectionGroup('stores')
    .where('approved', '==', true)
    .onSnapshot(snapshot => {
      setState(prevState => {
        return {
          ...prevState,
          approved: snapshot.size
        }
      })
    })
  }, [])

  // offline
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        disapproved: prevState.total - prevState.approved
      }
    })

  }, [state.approved, state.total])

  // filter items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        isButton: true
      }
    })

    let initialQuery = firestore.collectionGroup('stores')

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

      let initialQuery = firestore.collectionGroup('stores')
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

  const handleApprove = id => {

    const ref = firestore.collectionGroup('stores')
    .where('id', '==', id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        firestore.doc(doc.ref.path)
        .update({
          approved: true,
          isSpecialApprove: false,
          isTrial: true,
          trialExpiresIn: 3
        }).then(r => {
          unsubscribe()
        })
      })
    })

  }

  const handleSpecialApprove = id => {

    const ref = firestore.collectionGroup('stores')
    .where('id', '==', id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        firestore.doc(doc.ref.path)
        .update({
          approved: true,
          isSpecialApprove: true,
          isTrial: true,
          trialExpiresIn: 3
        }).then(r => {
          unsubscribe()
        })
      })
    })

  }

  const handleBlock = id => {

    firestore.collection('products')
    .doc(id)
    .update({
      isBlocked: true
    })
    .then(() => {})

  }

  const handleComment = id => {
    setState({
      ...state,
      isComment: true,
      comment: {
        id: id,
        text: ''
      }
    })
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
    collection: 'stores',
    condition: 'stores'
  }


  return(

    <div className={styles.AdminStores}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Stores
      </div>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          <DashboardSumWidget
            title={'Total'}
            description={'Number of all stores'}
            number={state.total}
            optionTitle={''}
            optionValue={''}
            handleFilters={handleFilters}
            current={state.currentFilters}
          />

          <DashboardSumWidget
            title={'Approved'}
            description={'All approved stores'}
            number={state.approved}
            optionTitle={'approved'}
            optionValue={true}
            handleFilters={handleFilters}
            current={state.currentFilters}
          />

          <DashboardSumWidget
            title={'Pending'}
            description={'All pending stores'}
            number={state.disapproved}
            optionTitle={'approved'}
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

        <div className={`${styles.customers} row`}>
          {
            state.isReady ?
              state.items.map((item, index) => (
                <DashboardItem
                  key={index}
                  item={item}
                  schema={schema}
                  handleBlock={handleBlock}
                  handleApprove={handleApprove}
                  handleComment={handleComment}
                  notifications={state.notifications}
                  handleSpecialApprove={handleSpecialApprove}
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

export default AdminStores
