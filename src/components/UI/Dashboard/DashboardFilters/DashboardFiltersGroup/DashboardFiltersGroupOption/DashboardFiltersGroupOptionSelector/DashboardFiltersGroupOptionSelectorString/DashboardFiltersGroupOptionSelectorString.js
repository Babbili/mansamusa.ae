import React, { useContext, useState } from 'react'
import AppContext from '../../../../../../../AppContext'
import Input from '../../../../../../Input/Input'
import SignUpButton from '../../../../../../SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'

import styles from '../DashboardFiltersGroupOptionSelector.module.scss'


const DashboardFiltersGroupOptionSelectorString = ({ handleClose, handleFilters, optionField, filterGroupTitle, filterGroupType, optionTitle }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    value: ''
  })

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
            Custom search
          </h3>
        </div>
      </div>

      <div className='row'>

        <div className='col-12'>

          <div className='row'>

            <div className='col-12'>

              <Input
                name={'value'}
                type={'text'}
                label={`Search by ${optionTitle[lang]}`}
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

export default DashboardFiltersGroupOptionSelectorString
