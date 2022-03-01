import React from 'react'
import DashboardFiltersGroup from './DashboardFiltersGroup/DashboardFiltersGroup'

import styles from './DashboardFilters.module.scss'


const DashboardFilters = ({ filters, current, handleClear, handleFilters }) => {

  return(

    <div className='col-12'>

      <div className={styles.DashboardFilters}>

        {
          filters.map((filter, index) => (
            <DashboardFiltersGroup
              key={index}
              index={index}
              current={current}
              filters={filters}
              filterGroup={filter}
              handleClear={handleClear}
              handleFilters={handleFilters}
            />
          ))
        }

      </div>

    </div>

  )

}

export default DashboardFilters
