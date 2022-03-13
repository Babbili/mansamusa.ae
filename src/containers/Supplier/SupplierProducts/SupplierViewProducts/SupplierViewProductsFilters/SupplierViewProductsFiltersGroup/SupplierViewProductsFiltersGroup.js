import React, { useContext } from 'react'
import AppContext from '../../../../../../components/AppContext'
import moment from 'moment'
import styles from './SupplierViewProductsFiltersGroup.module.scss'


const SupplierViewProductsFiltersGroup = ({ filter, handleClear, handleFilterDates }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <div className={styles.AdminViewProductsFiltersGroup}>
      <div className={styles.item}>
        { filter.type[lang] }
      </div>

      {
        filter.options.map((option, index) => {

          return(

            <div
              key={index}
              className={`${styles.item} ${option.selected ? styles.active : ''}`}
            >

            <span
              onClick={() => {
                handleFilterDates({type: filter.type, option: option.title})
              }}
            >
              {
                option.title.en === 'Custom dates' && typeof option.value === 'object' ?
                  `${moment.unix(option.value.startDate).format('DD/MM/YYYY')} — ${moment.unix(option.value.endDate).format('DD/MM/Y')}` :
                  option.title.en === 'Any' && option.value.length > 0 ? option.value : option.title[lang]
              }
            </span>

              {
                option.title.en === 'Any' && option.value.length > 0 ?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" onClick={() => handleClear()}><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg> : null
              }

            </div>

          )

        })
      }

    </div>

  )

}

export default SupplierViewProductsFiltersGroup
