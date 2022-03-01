import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../../../../../firebase/config'
import AppContext from '../../../../../../../AppContext'
import SignUpButton from '../../../../../../SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'
import Select from '../../../../../../Select/Select'

import styles from '../DashboardFiltersGroupOptionSelector.module.scss'


const DashboardFiltersGroupOptionSelectorMap = ({ handleClose, handleFilters, optionField, filterGroupTitle, filterGroupType, optionTitle, filterGroupCollection }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    items: [],
    value: ''
  })

  useEffect(() => {

    if (filterGroupCollection === 'stores') {

      return firestore.collectionGroup('stores')
      .onSnapshot(snapshot => {
        let items = []
        snapshot.forEach(doc => {
          items = [...items, {id: doc.id, title: doc.data().storeName}]
        })
        setState(prevState => {
          return {
            ...prevState,
            items
          }
        })
      })

    }

  }, [filterGroupCollection])

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  return(

    <div className={styles.wrapper}>

      <div className='row justify-content-center'>
        <div className='col-12'>
          <h3>
            Select brand name
          </h3>
        </div>
      </div>

      <div className='row'>

        <div className='col-12'>

          <div className='row'>

            <div className='col-12'>

              <Select
                lang={lang}
                name={'value'}
                title={ t('selectBrandName.label') }
                options={state.items}
                value={state.value}
                handleChange={handleChange}
              />

            </div>

          </div>

        </div>

      </div>

      <div className='row justify-content-center mt-4'>

        <div className='col-lg-4 col-12'>

          <SignUpButton
            type={'custom'}
            title={ t('cancel.label') }
            onClick={handleClose}
            disabled={false}
            isWide={true}
          />

        </div>

        <div className='col-lg-4 col-12'>

          <SignUpButton
            type={'custom'}
            title={ t('set.label') }
            onClick={() => {
              handleFilters({
                filterGroupTitle,
                filterGroupType,
                optionTitle,
                optionValue: {
                  field: optionField,
                  value: state.value
                },
                type: 'await'
              })
              handleClose()
            }}
            disabled={false}
            isWide={true}
          />

        </div>

      </div>

    </div>

  )

}

export default DashboardFiltersGroupOptionSelectorMap
