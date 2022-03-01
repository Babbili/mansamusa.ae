import React from 'react'
import styles from './SupplierViewProductsFilters.module.scss'
import SupplierViewProductsFiltersGroup from './SupplierViewProductsFiltersGroup/SupplierViewProductsFiltersGroup'


const SupplierViewProductsFilters = ({ filters, handleClear, handleFilterDates }) => {

  return(

    <div className={`${styles.AdminViewProductsFilters} col-12`}>

      {
        filters.map((filter, index) => (
          <SupplierViewProductsFiltersGroup
            key={index}
            filter={filter}
            handleClear={handleClear}
            handleFilterDates={handleFilterDates}
          />
        ))
      }

    </div>

  )

}

export default SupplierViewProductsFilters
