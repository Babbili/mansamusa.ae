import React, { useState } from 'react'
import Input from '../../../../../../Input/Input'
import moment from 'moment'
import SignUpButton from '../../../../../../SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'

import styles from '../DashboardFiltersGroupOptionSelector.module.scss'


const DateTime = ({ handleClose, handleFilters, filterGroupTitle, filterGroupType, optionTitle, filterGroupCollection }) => {

  let { t } = useTranslation()

  const [state, setState] = useState({
    startDate: {
      ts: '',
      value: ''
    },
    endDate: {
      ts: '',
      value: ''
    }
  })

  const handleChange = event => {
    const { value, name } = event.target
    let date = name === 'startDate' ?
      moment(value).startOf('day').unix() :
      moment(value).endOf('day').unix()
    setState({
      ...state,
      [name]: {
        ts: date,
        value
      }
    })
  }

  return(

    <div className={styles.wrapper}>

      <div className='row justify-content-center'>
        <div className='col-12'>
          <h3>
            Custom dates
          </h3>
        </div>
      </div>

      <div className='row'>

        <div className='col-12'>

          <div className='row'>

            <div className='col-lg-6 col-12'>

              <Input
                name={'startDate'}
                type={'date'}
                label={'Select start date'}
                value={state.startDate.value}
                handleChange={handleChange}
              />

            </div>

            <div className='col-lg-6 col-12'>

              <Input
                name={'endDate'}
                type={'date'}
                label={'Select end date'}
                value={state.endDate.value}
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
                filterGroupCollection,
                optionTitle,
                optionValue: {
                  startDate: state.startDate.ts,
                  endDate: state.endDate.ts
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

export default DateTime
