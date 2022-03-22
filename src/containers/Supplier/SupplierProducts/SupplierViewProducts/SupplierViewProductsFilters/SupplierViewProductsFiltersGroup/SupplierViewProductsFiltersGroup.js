import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                  <FontAwesomeIcon
                    icon='times-circle'
                    fixedWidth
                    onClick={() => handleClear()}
                  /> : null
              }

            </div>

          )

        })
      }

    </div>

  )

}

export default SupplierViewProductsFiltersGroup
