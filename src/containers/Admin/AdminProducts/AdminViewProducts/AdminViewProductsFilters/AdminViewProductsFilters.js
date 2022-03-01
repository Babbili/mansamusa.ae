import React from 'react'
import AdminViewProductsFiltersGroup from "./AdminViewProductsFiltersGroup/AdminViewProductsFiltersGroup"

import styles from './AdminViewProductsFilters.module.scss'


const AdminViewProductsFilters = ({ filters, handleClear, handleFilterDates }) => {

  return(

    <div className={`${styles.AdminViewProductsFilters} col-12`}>

      {
        filters.map((filter, index) => (
          <AdminViewProductsFiltersGroup
            key={index}
            index={index}
            filter={filter}
            filters={filters}
            handleClear={handleClear}
            handleFilterDates={handleFilterDates}
          />
        ))
      }

    </div>

  )

}

export default AdminViewProductsFilters
