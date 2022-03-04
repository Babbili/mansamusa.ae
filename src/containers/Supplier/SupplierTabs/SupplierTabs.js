import React from 'react'
import styles from './SupplierTabs.module.scss'


const SupplierTabs = ({ tabs, tabsIndex, handleIndex }) => {

  return(

    <div className={styles.SupplierTabs}>

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

export default SupplierTabs
