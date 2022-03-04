import React from 'react'
import moment from 'moment'

import styles from './DashboardWidget.module.scss'


const DashboardWidget = ({ link, title, description, number, optionTitle, optionValue, handleFilters }) => {


  return(

    <div
      className={`${styles.DashboardWidget} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      onClick={() => {
        if (link === undefined) {
          handleFilters({
            filterGroupTitle: 'DashboardSum',
            optionTitle: optionTitle,
            optionValue: optionValue,
            filterGroupType: 'topFilter'
          })
        }
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <h3>{ title }</h3>
          <div className={styles.description}>
            {
              typeof description !== 'number' ?
                description : moment.unix(description).format('LLLL')
            }
          </div>
        </div>
        <div className={styles.right}>
          <h3>
            {
              number !== undefined ?
                number.toFixed() : ' '
            }
          </h3>
        </div>
      </div>
    </div>

  )

}

export default DashboardWidget
