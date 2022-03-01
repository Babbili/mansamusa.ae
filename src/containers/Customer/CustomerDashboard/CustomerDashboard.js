import React, { useContext } from 'react'
import AppContext from '../../../components/AppContext'
import DashboardWidget from '../../../components/UI/Dashboard/DashboardWidget/DashboardWidget'

import styles from './CustomerDashboard.module.scss'


const CustomerDashboard = props => {

  const context = useContext(AppContext)
  let { lang } = context
  const { currentUser } = context

  const doNothing = () => {}

  return(

    <div className={styles.CustomerDashboard}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Customer Dashboard
      </div>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          {
            currentUser !== null && currentUser.dashboard !== undefined ?
            currentUser.dashboard.map((d, i) => (

              <DashboardWidget
                key={i}
                title={d.title}
                description={d.description}
                number={d.value}
                optionTitle={''}
                optionValue={''}
                handleFilters={() => doNothing}
              />

            )) : null
          }

        </div>

      </div>

    </div>

  )

}

export default CustomerDashboard
