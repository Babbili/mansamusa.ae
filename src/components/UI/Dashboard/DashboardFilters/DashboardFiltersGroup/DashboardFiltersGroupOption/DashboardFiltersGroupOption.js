import React, { useEffect, useState } from 'react'
import moment from 'moment'
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => handleClear(filterGroupTitle, option.title)}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg> : null
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
