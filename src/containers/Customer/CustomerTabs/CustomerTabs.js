import React from 'react'
import styles from './CustomerTabs.module.scss'


const CustomerTabs = ({ tabs, tabsIndex, handleIndex }) => {

  return(

    <div className={styles.CustomerTabs}>

      {
        tabs.map((tab, index) => {
          return(
            <div
              key={index}
              className={`${styles.item} ${tabsIndex === index ? styles.active : ''}`}
              onClick={() => handleIndex(index)}
            >
              { tab }
            </div>
          )
        })
      }

    </div>

  )

}

export default CustomerTabs
