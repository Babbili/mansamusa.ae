import React from 'react'
import DateTime from './DateTime/DateTime'
import DashboardFiltersGroupOptionSelectorString
  from './DashboardFiltersGroupOptionSelectorString/DashboardFiltersGroupOptionSelectorString'
import DashboardFiltersGroupOptionSelectorMap
  from './DashboardFiltersGroupOptionSelectorMap/DashboardFiltersGroupOptionSelectorMap'

import styles from './DashboardFiltersGroupOptionSelector.module.scss'


const DashboardFiltersGroupOptionSelector = ({ optionTitle, handleClose, optionField, handleFilters, filterGroupType, filterGroupTitle, filterGroupCollection }) => {

  return(

    <div className={styles.DashboardFiltersGroupOptionSelector}>

      {
        filterGroupType === 'datetime' ?
          <DateTime
            optionTitle={optionTitle}
            handleClose={handleClose}
            handleFilters={handleFilters}
            filterGroupType={filterGroupType}
            filterGroupTitle={filterGroupTitle}
            filterGroupCollection={filterGroupCollection}
          /> :
          filterGroupType === 'string' ?
            <DashboardFiltersGroupOptionSelectorString
              optionTitle={optionTitle}
              optionField={optionField}
              handleClose={handleClose}
              handleFilters={handleFilters}
              filterGroupType={filterGroupType}
              filterGroupTitle={filterGroupTitle}
            /> :
            filterGroupType === 'map' ?
              <DashboardFiltersGroupOptionSelectorMap
                optionTitle={optionTitle}
                optionField={optionField}
                handleClose={handleClose}
                handleFilters={handleFilters}
                filterGroupType={filterGroupType}
                filterGroupTitle={filterGroupTitle}
                filterGroupCollection={filterGroupCollection}
              /> : null
      }

    </div>

  )

}

export default DashboardFiltersGroupOptionSelector
