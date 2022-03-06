import React, { useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import AdminViewProductsFilters from './AdminViewProductsFilters/AdminViewProductsFilters'
import AdminViewProductsItem from './AdminViewProductsItem/AdminViewProductsItem'
import AdminViewProductsCart from './AdminViewProductsCart/AdminViewProductsCart'
import AdminViewProductsFiltersSelector
  from './AdminViewProductsFilters/AdminViewProductsFiltersSelector/AdminViewProductsFiltersSelector'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import AdminViewProductsComment from './AdminViewProductsComment/AdminViewProductsComment'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import styles from './AdminViewProducts.module.scss'


const AdminViewProducts = props => {

  let { t } = useTranslation()

  const [state, setState] = useState({
    total: Number(),
    isApproved: Number(),
    isWaiting: Number(),
    filters: [
      {
        // type: 'Filter products by date',
        type: {
          en: 'Filter products by date',
          ar: 'تصفية المنتجات حسب التاريخ'
        },
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
            value: ''
          },
          {
            title: {
              en: 'This month',
              ar: 'هذا الشهر'
            },
            selected: false,
            value: ''
          },
          {
            title: {
              en: 'Custom dates',
              ar: 'تواريخ مخصصة'
            },
            selected: false,
            value: ''
          }
        ]
      },
      {
        // type: 'Filter by brand',
        type: {
          en: 'Filter by brand',
          ar: 'تصفية حسب الماركة'
        },
        options: [
          {
            title: {
              en: 'Any',
              ar: 'أي'
            },
            value: ''
          }
        ]
      }
    ],
    isSelector: false,
    selectorType: '',
    tempFilter: {},
    products: [],
    isReady: false,
    topFilters: {
      title: 'All',
      value: ''
    },
    isComment: false,
    comment: {},
    notifications: []
  })

  // count
  useEffect(() => {
    return firestore.collection('products')
    .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          total: snapShot.size
        }
      })
    })
  }, [])

  useEffect(() => {
    
    return firestore.collection('products')
    .onSnapshot(snapShot => {
      snapShot.forEach(doc => {
        setState(prevState => {
          return {
            ...prevState,
            products: [...prevState.products, doc.data()]
          }
        })
      })
    })
  }, [])

  // count approved
  useEffect(() => {
    return firestore.collection('products')
    .where('isApproved', '==', true)
    .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          isApproved: snapShot.size
        }
      })
    })
  }, [])

  // count waiting
  useEffect(() => {
    return firestore.collection('products')
    .where('isApproved', '==', false)
    .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          isWaiting: snapShot.size
        }
      })
    })
  }, [])

  // get all notifications
  useEffect(() => {

    firestore.collectionGroup('notifications')
    .onSnapshot(snapshot => {
      let notifications = []
      snapshot.forEach(doc => {
        notifications = [...notifications, {...doc.data()}]
      })
      setState(prevState => {
        return {
          ...prevState,
          notifications
        }
      })
    })

  }, [])

  // get all products today's filter
  useEffect(() => {

    setState(prevState => {
      return {
        ...prevState,
        isReady: false,
        products: [],
        isButton: true
      }
    })

    const currentFilters = state.filters
    .map(m => m.options).flat(1)
    .filter(f => f.selected)
    .map(m => m.value)

    let initialQuery

    if (currentFilters.length > 1) {
      if (state.topFilters.title === 'Approved') {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
        .where('storeName', '==', currentFilters[1])
        .where('isApproved', '==', true)
      } else if (state.topFilters.title === 'Waiting') {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
        .where('storeName', '==', currentFilters[1])
        .where('isApproved', '==', false)
      } else {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
        .where('storeName', '==', currentFilters[1])
      }
    } else {
      if (state.topFilters.title === 'Approved') {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
        .where('isApproved', '==', true)
      } else if (state.topFilters.title === 'Waiting') {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
        .where('isApproved', '==', false)
      } else {
        initialQuery = firestore.collection('products')
        .where('createdAt', '>=', currentFilters[0].startDate)
        .where('createdAt', '<=', currentFilters[0].endDate)
      }
    }

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
          products: documentData,
          visibles: [lastVisible],
          isReady: true
        }
      })

    })

  }, [state.filters, state.topFilters])

  const handleMore = async () => {

    try {

      setState({
        ...state,
        more: true
      })

      const currentFilters = state.filters
      .map(m => m.options).flat(1)
      .filter(f => f.selected)
      .map(m => m.value)

      let initialQuery = firestore.collection('products')

      if (currentFilters.length > 1) {
        if (state.topFilters.title === 'Approved') {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
          .where('storeName', '==', currentFilters[1])
          .where('isApproved', '==', true)
        } else if (state.topFilters.title === 'Waiting') {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
          .where('storeName', '==', currentFilters[1])
          .where('isApproved', '==', false)
        } else {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
          .where('storeName', '==', currentFilters[1])
        }
      } else {
        if (state.topFilters.title === 'Approved') {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
          .where('isApproved', '==', true)
        } else if (state.topFilters.title === 'Waiting') {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
          .where('isApproved', '==', false)
        } else {
          initialQuery = initialQuery
          .where('createdAt', '>=', currentFilters[0].startDate)
          .where('createdAt', '<=', currentFilters[0].endDate)
        }
      }


      let documentSnapshots = await initialQuery
      .startAfter(state.visibles[state.visibles.length - 1])
      .limit(10)
      .get()

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
          products: [...state.products, ...documentData],
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

  const handleFilterDates = filter => {

    let currentFilter = state.filters.map(f => {
      if (f.type.en === filter.type.en) {
        f.options.map(o => {
          if (o.title.en === filter.option.en) {
            if (filter.option.en === 'Today') {
              o.selected = true
              o.value = {
                startDate: moment().startOf('day').unix(),
                endDate: moment().endOf('day').unix()
              }
            } else if (filter.option.en === 'This week') {
              o.selected = true
              o.value = {
                startDate: moment().startOf('week').unix(),
                endDate: moment().endOf('week').unix()
              }
            } else if (filter.option.en === 'This month') {
              o.selected = true
              o.value = {
                startDate: moment().startOf('month').unix(),
                endDate: moment().endOf('month').unix()
              }
            }
          } else {
            if (filter.option.en !== 'Custom dates') {
              o.selected = false
              o.value = ''
            }
          }
          return o
        })
      }
      return f
    })

    if (filter.option.en === 'Custom dates') {
      setState({
        ...state,
        isSelector: true,
        selectorType: 'custom dates',
        tempFilter: filter
      })
    } else if (filter.option.en === 'Any') {
      setState({
        ...state,
        isSelector: true,
        selectorType: 'brands',
        tempFilter: filter
      })
    } else {
      setState({
        ...state,
        filters: currentFilter,
        tempFilter: filter
      })
    }

  }

  const handleCancel = () => {

    let { tempFilter } = state

    let currentFilter = state.filters.map(f => {
      if (f.type.en === tempFilter.type.en) {
        f.options.map(o => {
          if (o.title.en === tempFilter.option.en) {
            o.selected = false
            o.value = ''
          }
          return o
        })
      }
      return f
    })

    setState({
      ...state,
      isSelector: false,
      selectorType: '',
      filters: currentFilter,
      tempFilter: {}
    })

  }

  const handleCustomData = data => {

    let { tempFilter } = state

    let currentFilter = state.filters.map(f => {
      if (f.type.en === tempFilter.type.en) {
        f.options.map(o => {
          if (o.title.en === tempFilter.option.en) {
            o.value = data
            o.selected = true
          } else {
            o.value = ''
            o.selected = false
          }
          return o
        })
      }
      return f
    })

    setState({
      ...state,
      isSelector: false,
      selectorType: '',
      filters: currentFilter,
      tempFilter: {}
    })

  }

  const handleClear = () => {

    let currentFilter = state.filters.map(f => {
      if (f.type.en === 'Filter by brand') {
        f.options.map(o => {
          if (o.title.en === 'Any') {
            o.selected = false
            o.value = ''
          }
          return o
        })
      }
      return f
    })

    setState({
      ...state,
      filters: currentFilter
    })

  }

  const handleTopFilters = filter => {

    setState({
      ...state,
      topFilters: filter
    })

  }

  const handleApprove = id => {

    firestore.collection('products')
    .doc(id)
    .update({
      isApproved: true
    })
    .then(() => {})

  }

  const handleBlock = (id, isBlocked) => {

    firestore.collection('products')
    .doc(id)
    .update({
      isBlocked: isBlocked
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

  const handleCloseComment = () => {
    setState({
      ...state,
      isComment: false,
      comment: {}
    })
  }

  const handleSendComment = text => {

    firestore.collection('products')
    .doc(state.comment.id).collection('notifications')
    .add({
      productId: state.comment.id,
      comment: text,
      date: moment().unix(),
    })
    .then(() => {
      setState({
        ...state,
        isComment: false,
        comment: {}
      })
    })

  }


  return(

    <div className={styles.AdminViewProducts}>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          <AdminViewProductsCart
            title={ t('all.label') }
            description={ t('totalNumberOfProducts.label') }
            number={state.total}
            filter={'All'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

          <AdminViewProductsCart
            title={ t('approved.label') }
            description={ t('approvedProductsNumber.label') }
            number={state.isApproved}
            filter={'Approved'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

          <AdminViewProductsCart
            title={ t('waiting.label') }
            description={ t('productsOnApproval.label') }
            number={state.isWaiting}
            filter={'Waiting'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

        </div>

        <div className='row mt-4 mb-2'>
          <AdminViewProductsFilters
            filters={state.filters}
            handleClear={handleClear}
            handleFilterDates={handleFilterDates}
          />
        </div>

        <div className={`${styles.products} row`}>
          {
            state.isReady > 0 ?
              <AdminViewProductsItem
                products={state.products}
                handleBlock={handleBlock}
                handleApprove={handleApprove}
                handleComment={handleComment}
                notifications={state.notifications}
              /> :
              <div className='col-12 my-5'>
                <BasicSpinner />
              </div>
          }
        </div>

        <div className='row mt-2 mb-2 justify-content-center'>

          {
            state.isButton ?
              state.products.length > 0 ?
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

        {
          state.isSelector ?
            <AdminViewProductsFiltersSelector
              type={state.selectorType}
              handleCancel={handleCancel}
              handleCustomData={handleCustomData}
            /> : null
        }

        {
          state.isComment ?
            <AdminViewProductsComment
              handleSendComment={handleSendComment}
              handleCloseComment={handleCloseComment}
            /> : null
        }

      </div>

    </div>

  )

}

export default AdminViewProducts
