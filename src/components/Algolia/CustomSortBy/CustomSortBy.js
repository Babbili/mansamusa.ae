import React, { useState } from 'react'
import { connectSortBy } from 'react-instantsearch-dom'

import styles from './CustomSortBy.module.scss'


const CustomSortBy = ({ items, refine, createURL }) => {

  const [selected, setSelected] = useState('Sort By')
  const [isOpen, setIsOpen] = useState(false)

  return(

    <div
      className={`${styles.CustomSortBy} ${isOpen ? styles.open : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.select}>

        <div className={styles.trigger}>
          <span>{ selected }</span>
          <div className={styles.arrow} />
        </div>

        <div className={styles.options}>

          {
            items.map(item => (

              <span
                key={item.value}
                className={`${styles.option} ${item.isRefined ? styles.selected : ''}`}
                onClick={event => {
                  event.preventDefault()
                  refine(item.value)
                  setSelected(item.label)
                }}
              >
                { item.label }
              </span>

            ))

          }

        </div>
      </div>
    </div>

  )

}

export default connectSortBy(CustomSortBy)