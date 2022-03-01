import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../../../components/AppContext'
import { firestore } from '../../../../../../firebase/config'
import SignUpButton from '../../../../../../components/UI/SignUpButton/SignUpButton'
import Input from '../../../../../../components/UI/Input/Input'
import Select from '../../../../../../components/UI/Select/Select'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import styles from './AdminViewProductsFiltersSelector.module.scss'


const AdminViewProductsFiltersSelector = ({ type, handleCancel, handleCustomData }) => {

  const context = useContext(AppContext)
  const { lang } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    startDate: '',
    endDate: '',
    dates: {},
    brand: '',
    brands: []
  })

  useEffect(() => {

    if (type === 'brands') {

      return firestore.collectionGroup('stores')
      .where('approved', '==', true)
      .onSnapshot(snapshot => {
        let brands = []
        snapshot.forEach(doc => {
          brands = [...brands, {id: doc.id, title: doc.data().storeName}]
        })
        setState(prevState => {
          return {
            ...prevState,
            brands
          }
        })
      })

    }

  }, [type])

  const handleChangeDates = event => {
    const { value, name } = event.target
    let date = name === 'startDate' ?
      moment(value).startOf('day').unix() :
      moment(value).endOf('day').unix()
    setState({
      ...state,
      [name]: value,
      dates: {
        ...state.dates,
        [name]: date
      }
    })
  }

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }


  return(

    <div className={styles.AdminViewProductsFiltersSelector}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>
              {
                type === 'brands' ?
                  lang === 'en' ? 'Select brand' : 'حدد العلامة التجارية' :
                  type !== 'brands' ?
                    lang === 'en' ? 'Select custom dates' : 'حدد التواريخ المخصصة' : ''
              }
            </h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>

            {
              type === 'brands' ?
                <div className='row'>
                  <div className='col-12'>
                    <Select
                      lang={lang}
                      name={'brand'}
                      title={ t('selectBrandName.label') }
                      options={state.brands}
                      value={state.brand}
                      handleChange={handleChange}
                    />
                  </div>
                </div> :
                <div className='row'>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name={'startDate'}
                      type={'date'}
                      label={ t('selectStartDate.label') }
                      value={state.startDate}
                      handleChange={handleChangeDates}
                    />
                  </div>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name={'endDate'}
                      type={'date'}
                      label={ t('selectEndDate.label') }
                      value={state.endDate}
                      handleChange={handleChangeDates}
                    />
                  </div>
                </div>
            }

          </div>
        </div>

        <div className='row justify-content-center mt-4'>

          <div className='col-lg-4 col-12'>
            <SignUpButton
              type={'custom'}
              title={ t('cancel.label') }
              onClick={handleCancel}
              disabled={false}
            />
          </div>

          {
            type === 'brands' ?
              state.brand.length > 0 ?
                <div className='col-lg-4 col-12'>
                  {
                    <SignUpButton
                      type={'custom'}
                      title={ t('set.label') }
                      onClick={() => handleCustomData(state.brand)}
                      disabled={false}
                    />
                  }
                </div> : null :
                state.startDate.length > 0 && state.endDate.length > 0 ?
                  <div className='col-lg-4 col-12'>
                    {
                      <SignUpButton
                        type={'custom'}
                        title={ t('set.label') }
                        onClick={() => handleCustomData(state.dates)}
                        disabled={false}
                      />
                    }
                  </div> : null
          }

        </div>

      </div>

    </div>

  )

}

export default AdminViewProductsFiltersSelector
