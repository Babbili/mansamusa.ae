import React from 'react'
import { connectToggleRefinement } from 'react-instantsearch-dom'

import styles from './DashboardToggleRefinement.module.scss'


const DashboardToggleRefinement = ({ currentRefinement, refine, label, description, count, value }) => {


  return(

    <div
      className={`${styles.DashboardToggleRefinement} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      onClick={event => {
        event.preventDefault()
        refine(!currentRefinement)
      }}
    >
      <div className={`${styles.wrapper} ${currentRefinement ? styles.active : ''}`}>
        <div className={styles.left}>
          <h3>
            { label }
          </h3>
          <div className={styles.description}>
            { description }
          </div>
        </div>
        <div className={styles.right}>
          <h3>
            { count.unchecked }
          </h3>
        </div>
      </div>
    </div>

  )

}

export default connectToggleRefinement(DashboardToggleRefinement)
