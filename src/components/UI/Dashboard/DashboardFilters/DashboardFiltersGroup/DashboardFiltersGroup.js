import React, { useContext } from 'react'
import AppContext from '../../../../../components/AppContext'
import DashboardFiltersGroupOption from './DashboardFiltersGroupOption/DashboardFiltersGroupOption'

import styles from './DashboardFiltersGroup.module.scss'


const DashboardFiltersGroup = ({ index, filters, current, filterGroup, handleClear, handleFilters }) => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context


  return(

    <div className={styles.DashboardFiltersGroup}>

      <div
        className={styles.title}
        style={{
          display: isMobile && index === filters.length - 1 && index !== 0 ? 'none' : ''
        }}
      >
        {
          isMobile && index === 0 ?
            'Filter by' : filterGroup.title[lang]
        }
      </div>

      {
        filterGroup.options.map((option, index) => (

          <DashboardFiltersGroupOption
            key={index}
            lang={lang}
            option={option}
            current={current}
            handleClear={handleClear}
            handleFilters={handleFilters}
            filterGroupType={filterGroup.type}
            filterGroupTitle={filterGroup.title.en}
            filterGroupCollection={filterGroup.collection}
          />

        ))

      }

    </div>

  )

}

export default DashboardFiltersGroup
