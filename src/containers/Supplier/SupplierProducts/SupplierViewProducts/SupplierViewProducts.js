import React, { useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import { useTranslation } from 'react-i18next'
import SupplierViewProductsItem from './SupplierViewProductsItem/SupplierViewProductsItem'
import SupplierViewProductsCart from './SupplierViewProductsCart/SupplierViewProductsCart'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import SupplierViewProductsAdd from './SupplierViewProductsAdd/SupplierViewProductsAdd'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './SupplierViewProducts.module.scss'

const SupplierViewProducts = ({ currentStore, ...props }) => {

  let { t } = useTranslation()

  const [state, setState] = useState({
    total: Number(),
    isApproved: Number(),
    isWaiting: Number(),
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
      .where('store', '==', currentStore.id)
      .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          total: snapShot.size
        }
      })
    })
  }, [currentStore.id])

  // count approved
  useEffect(() => {
    return firestore.collection('products')
      .where('store', '==', currentStore.id)
      .where('isApproved', '==', true)
      .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          isApproved: snapShot.size
        }
      })
    })
  }, [currentStore.id])

  // count waiting
  useEffect(() => {
    return firestore.collection('products')
      .where('store', '==', currentStore.id)
      .where('isApproved', '==', false)
      .onSnapshot(snapShot => {
      setState(prevState => {
        return {
          ...prevState,
          isWaiting: snapShot.size
        }
      })
    })
  }, [currentStore.id])

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

    let initialQuery

    if (state.topFilters.title === 'Approved') {
      initialQuery = firestore.collection('products')
        .where('store', '==', currentStore.id)
        .where('isApproved', '==', true)
    } else if (state.topFilters.title === 'Waiting') {
      initialQuery = firestore.collection('products')
        .where('store', '==', currentStore.id)
        .where('isApproved', '==', false)
    } else {
      initialQuery = firestore.collection('products')
        .where('store', '==', currentStore.id)
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

  }, [state.topFilters, currentStore.id])

  const handleMore = async () => {

    try {

      setState({
        ...state,
        more: true
      })

      let initialQuery = firestore.collection('products')
        .startAfter(state.visibles[state.visibles.length - 1])
        .limit(10)

      if (state.topFilters.title === 'Approved') {
        initialQuery = initialQuery
          .where('store', '==', currentStore.id)
          .where('isApproved', '==', true)
      } else if (state.topFilters.title === 'Waiting') {
        initialQuery = initialQuery
          .where('store', '==', currentStore.id)
          .where('isApproved', '==', false)
      } else {
        initialQuery = initialQuery
          .where('store', '==', currentStore.id)
      }


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

  const handleTopFilters = filter => {

    setState({
      ...state,
      topFilters: filter
    })

  }

  const handleEdit = id => {

    props.history.push(`/supplier/products/edit-product/${id}`)

  }

  const handleRemove = id => {
    firestore.collection('products')
      .doc(id).delete()
      .then(r => {})
  }


  return(

    <div className={styles.AdminViewProducts}>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          <SupplierViewProductsCart
            title={ t('all.label') }
            description={ t('totalNumberOfProducts.label') }
            number={state.total}
            filter={'All'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

          <SupplierViewProductsCart
            title={ t('approved.label') }
            description={ t('approvedProductsNumber.label') }
            number={state.isApproved}
            filter={'Approved'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

          <SupplierViewProductsCart
            title={ t('waiting.label') }
            description={ t('productsOnApproval.label') }
            number={state.isWaiting}
            filter={'Waiting'}
            currentFilter={state.topFilters}
            handleTopFilters={handleTopFilters}
          />

          <SupplierViewProductsAdd
            {...props}
          />

        </div>

        <div className={`${styles.products} row`}>
          {
            state.isReady > 0 ?
              <SupplierViewProductsItem
                handleEdit={handleEdit}
                products={state.products}
                handleRemove={handleRemove}
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
                    title={ t('seeMore.label')}
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
                  <FontAwesomeIcon icon={'smile'} /> {t('allLoaded.label')}
                </h5>
              </div>
          }

        </div>

      </div>

    </div>

  )

}

export default SupplierViewProducts
