import React from 'react'
import moment from 'moment'

import styles from './DashboardItemDetailsWidget.module.scss'


const DashboardItemDetailsWidget = ({ title, description, value }) => {

  return(

    <div
      className={`${styles.DashboardItemDetailsWidget} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
    >
      <div className={`${styles.wrapper}`}>
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
              typeof value === 'number' ?
                value.toFixed(0) : value
            }
          </h3>
        </div>
      </div>
    </div>

  )

}

export default DashboardItemDetailsWidget
