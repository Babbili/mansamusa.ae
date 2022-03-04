import React, { useContext, useEffect, useState } from 'react'
import noProducts from '../../../assets/abc.jpg'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../components/AppContext'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { firestore } from '../../../firebase/config'
import { dateTime, stringFilter, topFilter } from '../../Admin/utility/utility'
import DashboardSumWidget from '../../../components/UI/Dashboard/DashboardSumWidget/DashboardSumWidget'
import DashboardFilters from '../../../components/UI/Dashboard/DashboardFilters/DashboardFilters'
import DashboardItem from '../../../components/UI/Dashboard/DashboardItem/DashboardItem'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './SupplierAbandonedCarts.module.scss'


const SupplierAbandonedCarts = ({ isTrial, approved, isSubscribed, currentStore }) => {

  const context = useContext(AppContext)
  let { lang } = context
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
    isButton: true,
    isBanner: true
  })

  // count all items
  useEffect(() => {
    return firestore.collectionGroup('abandonedCarts')
    .where('stores', 'array-contains', currentStore.id)
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

  // filter items
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        isButton: true
      }
    })

    let initialQuery = firestore.collectionGroup('abandonedCarts')
    .where('stores', 'array-contains', currentStore.id)

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
          isReady: true,
          isBanner: documentData.length === 0
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

      let initialQuery = firestore.collectionGroup('abandonedCarts')
      .where('stores', 'array-contains', currentStore.id)
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
    collection: 'abandonedCarts',
    condition: 'abandonedCarts'
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

      {
        state.isBanner ?
          <div className={`${styles.emptyData}`}>
            <div className='col-12 text-center'>
              <img src={noProducts} alt={'Nothing Here Yet'} />
              <h3>
                { t('noAbandonedCartsYet.label') }
              </h3>
              <div className={styles.description}>
                { t('informationWillBeShownHereAsSoonAsSalesStart.label') }
              </div>
            </div>
          </div> :
          <div className={styles.SupplierAbandonedCarts}>

            <div
              className={styles.title}
              style={{
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}
            >
              { t('manageAbandonedCarts.label') }
            </div>

            <div className='container-fluid'>

              <div className={`${styles.dashboard} row`}>

                <DashboardSumWidget
                  title={'Total'}
                  description={'Number of all customers wishlists'}
                  number={state.total}
                  optionTitle={''}
                  optionValue={''}
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

              <div className={`${styles.lists} row`}>
                {
                  state.isReady ?
                    state.items.map((item, index) => (
                      <DashboardItem
                        key={index}
                        item={item}
                        schema={schema}
                        currentStore={currentStore.id}
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
                          title={'Load More'}
                          type={'custom'}
                          onClick={handleMore}
                          disabled={false}
                          isWide={true}
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
      }

    </>

  )

}

export default SupplierAbandonedCarts
