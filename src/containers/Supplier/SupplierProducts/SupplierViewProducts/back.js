import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import AppContext from '../../../../components/AppContext'
import Input from '../../../../components/UI/Input/Input'
import Select from '../../../../components/UI/Select/Select'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import SupplierViewProductsTable from './SupplierViewProductsTable/SupplierViewProductsTable'
import SupplierProductsNoProducts from '../SupplierProductsNoProducts/SupplierProductsNoProducts'
import { useTranslation } from 'react-i18next'
import Pagination from '../../../../components/UI/Pagination/Pagination'

import styles from './SupplierViewProducts.module.scss'


const SupplierViewProducts = ({ currentStore, ...props }) => {

    const context = useContext(AppContext)
    let { lang } = context
    let { t } = useTranslation()

    const [isLoaded, setIsLoaded] = useState(false)
    const [state, setState] = useState({
        count: 0,
        pages: 0,
        currentPage: 1,
        data: [],
        visibles: [],
        quantity: 10,
        quantityOptions: [
            {id: '10', title: '10'},
            {id: '25', title: '25'},
            {id: '50', title: '50'},
            {id: '100', title: '100'}
        ],
        search: '',
        loading: false,
        limit: 10,
        refreshing: false
    })

    useEffect(() => {

        return firestore.collection('products')
            .where('store', '==', currentStore.id)
            .onSnapshot(snapShot => {

                setState(prevState => {
                    return {
                        ...prevState,
                        count: snapShot.size,
                        pages: Math.ceil(snapShot.size / prevState.limit)
                    }
                })

            })

    }, [currentStore])

    useEffect(() => {

        return firestore.collection('products')
            .where('store', '==', currentStore.id)
            .limit(state.limit)
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
                        data: documentData,
                        visibles: [lastVisible],
                        loading: false,
                        refreshing: false
                    }
                })

                setIsLoaded(true)

            })

    }, [state.limit, currentStore])

    const retrieveMore = async (id, page) => {

        if ((page * state.limit) - state.limit + 1 <= state.data.length) {

            setState({
                ...state,
                currentPage: page
            })

        } else {

            try {

                setState({
                    ...state,
                    loading: true
                })

                let initialQuery = await firestore.collection('products')
                    .where('store', '==', id)
                    .startAfter(state.visibles[state.visibles.length - 1])
                    .limit(page !== undefined ? state.limit * (page - state.currentPage) : state.limit)

                let documentSnapshots = await initialQuery.get()

                let lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

                let documentData = documentSnapshots.docs.map(document => {
                    return {
                        id: document.id,
                        ...document.data()
                    }
                })

                setState({
                    ...state,
                    currentPage: page !== undefined ? page :
                        state.currentPage !== state.pages ? state.currentPage + 1 : state.pages,
                    data: [...state.data, ...documentData],
                    visibles: [...state.visibles, lastVisible],
                    loading: false,
                    refreshing: false
                })

            }
            catch (error) {
                console.log(error)
            }

        }

    }

    const handlePrev = () => {
        setState({
            ...state,
            currentPage: state.currentPage !== 1 ? state.currentPage - 1 : 1
        })
    }

    const handleNext = async () => {

        if (((state.currentPage + 1) * state.limit) - state.limit + 1 <= state.data.length) {

            setState({
                ...state,
                currentPage: state.currentPage !== state.data.length ? state.currentPage + 1 : state.data.length
            })

        } else {

            try {

                setState({
                    ...state,
                    loading: true
                })

                let initialQuery = await firestore.collection('products')
                    .where('store', '==', currentStore.id)
                    .startAfter(state.visibles[state.visibles.length - 1])
                    .limit(state.limit)

                let documentSnapshots = await initialQuery.get()

                let lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

                let documentData = documentSnapshots.docs.map(document => {
                    return {
                        id: document.id,
                        ...document.data()
                    }
                })

                setState({
                    ...state,
                    currentPage: state.currentPage !== state.pages ? state.currentPage + 1 : state.pages,
                    data: [...state.data, ...documentData],
                    visibles: [...state.visibles, lastVisible],
                    loading: false,
                    refreshing: false
                })

            }
            catch (error) {
                console.log(error)
            }

        }

    }

    const handleExactPage = page => {

        retrieveMore(currentStore.id, page)

    }

    const handleLimit = event => {

        const { value } = event.target

        let limit = Number(value)
        setIsLoaded(false)
        setState({
            ...state,
            currentPage: 1,
            limit: limit,
            quantity: value,
            pages: Math.ceil(state.count / limit),
            data: []
        })

    }


    return(

        <div className={styles.SupplierViewProducts}>
            {
                isLoaded ?
                    <React.Fragment>
                        {
                            state.data.length > 0 ?
                                <div className='container-fluid'>
                                    <div className='row justify-content-between'>
                                        <div className='col-lg-3 col-8'>
                                            <div className='row'>
                                                <div className={`col-8 ${lang !== 'en' ? 'pl-0' : 'pr-0'}`} style={{pointerEvents: 'none'}}>
                                                    <Input
                                                        name='ShowRecords'
                                                        type='text'
                                                        label={ t('showRecords.label') }
                                                        defaultValue={ t('showRecords.label') }
                                                    />
                                                </div>
                                                <div className='col-4 p-0'>
                                                    <Select
                                                        name='quantity'
                                                        options={state.quantityOptions}
                                                        value={state.quantity}
                                                        handleChange={handleLimit}
                                                        // title={'Show Records'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-4 d-none d-lg-flex'>
                                            {/*<Input*/}
                                            {/*  name='search'*/}
                                            {/*  type='text'*/}
                                            {/*  label='Search Products'*/}
                                            {/*  value={state.search}*/}
                                            {/*  handleChange={(e) => handleChange(e)}*/}
                                            {/*/>*/}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 overflow-auto'>
                                            <SupplierViewProductsTable
                                                t={t}
                                                lang={lang}
                                                limit={state.limit}
                                                products={state.data}
                                                currentPage={state.currentPage}
                                                {...props}
                                            />
                                        </div>
                                    </div>

                                    <Pagination
                                        state={state}
                                        handlePrev={handlePrev}
                                        handleNext={handleNext}
                                        handleExactPage={handleExactPage}
                                    />

                                </div> :
                                <SupplierProductsNoProducts {...props} />
                        }
                    </React.Fragment> :
                    <BasicSpinner />
            }
        </div>

    )

}

export default SupplierViewProducts
