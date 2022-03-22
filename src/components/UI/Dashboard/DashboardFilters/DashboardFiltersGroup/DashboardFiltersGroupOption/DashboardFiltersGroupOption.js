import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DashboardFiltersGroupOptionSelector
  from './DashboardFiltersGroupOptionSelector/DashboardFiltersGroupOptionSelector'

import styles from './DashboardFiltersGroupOption.module.scss'


const DashboardFiltersGroupOption = ({ lang, option, current, handleFilters, handleClear, filterGroupType, filterGroupTitle, filterGroupCollection }) => {

  const [state, setState] = useState({
    isSelector: false,
    isSelected: false,
    title: null
  })

  useEffect(() => {

    let isSelected = current
    .some(s => s.filterGroupTitle === filterGroupTitle &&
      s.optionTitle.en === option.title.en)

    let title = current
    .filter(f => f.filterGroupTitle === filterGroupTitle && f.optionTitle.en === option.title.en)
    .map(m => m.optionValue)[0]

    setState(prevState => {
      return {
        ...prevState,
        isSelected: isSelected,
        title
      }
    })

  }, [current, option.title, filterGroupTitle])

  const handleClose = () => {
    setState({
      ...state,
      isSelector: false
    })
  }

  const handleOpen = () => {
    setState({
      ...state,
      isSelector: true
    })
  }


  return(

    <div
      className={`${styles.DashboardFiltersGroupOption} ${state.isSelected ? styles.active : ''}`}
    >

      <span
        onClick={() => {
          if (option.type !== 'await') {
            handleFilters({
              filterGroupTitle,
              filterGroupType,
              filterGroupCollection,
              optionTitle: option.title,
              optionValue: option.value
            })
          } else {
            handleOpen()
          }
        }}
      >
        {
          (state.isSelected && option.type === 'await' && filterGroupType === 'string') ||
          (state.isSelected && option.type === 'await' && filterGroupType === 'map') ?
            state.title.value :
            state.isSelected && option.type === 'await' && filterGroupType === 'datetime' ?
              `${moment.unix(state.title.startDate).format('DD/MM/YYYY')} — ${moment.unix(state.title.endDate).format('DD/MM/Y')}` :
              option.title[lang]
        }
      </span>

      {
        state.isSelected && option.type === 'await' ?
          <FontAwesomeIcon
            icon='times-circle'
            fixedWidth
            onClick={() => handleClear(filterGroupTitle, option.title)}
          /> : null
      }

      {
        state.isSelector ?
          <DashboardFiltersGroupOptionSelector
            handleClose={handleClose}
            optionTitle={option.title}
            optionField={option.field}
            handleFilters={handleFilters}
            filterGroupType={filterGroupType}
            filterGroupTitle={filterGroupTitle}
            filterGroupCollection={filterGroupCollection}
          /> : null
      }

    </div>

  )

}

export default DashboardFiltersGroupOption
