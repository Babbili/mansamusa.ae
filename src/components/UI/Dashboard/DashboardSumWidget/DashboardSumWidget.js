import React, { useEffect, useState } from 'react'

import styles from './DashboardSumWidget.module.scss'


const DashboardSumWidget = ({ title, description, number, optionTitle, optionValue, current, handleFilters }) => {

  const [isSelected, setSelected] = useState(false)

  useEffect(() => {

    let isSelected = current
    .some(s => s.filterGroupTitle === 'DashboardSum' &&
      s.optionTitle === optionTitle &&
      s.optionValue === optionValue
    )

    setSelected(isSelected)

  }, [optionTitle, optionValue, current])


  return(

    <div
      className={`${styles.DashboardSumWidget} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      onClick={() => {
        handleFilters({
          filterGroupTitle: 'DashboardSum',
          optionTitle: optionTitle,
          optionValue: optionValue,
          filterGroupType: 'topFilter'
        })
      }}
    >
      <div className={`${styles.wrapper} ${isSelected ? styles.active : ''}`}>
        <div className={styles.left}>
          <h3>{ title }</h3>
          <div className={styles.description}>
            { description }
          </div>
        </div>
        <div className={styles.right}>
          <h3>
            { number }
          </h3>
        </div>
      </div>
    </div>

  )

}

export default DashboardSumWidget
