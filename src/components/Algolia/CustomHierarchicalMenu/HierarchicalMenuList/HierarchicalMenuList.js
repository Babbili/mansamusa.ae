import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './HierarchicalMenuList.module.scss'


const HierarchicalMenuList = ({ items, refine, createURL }) => {

  const [isToggle, setIsToggle] = useState(false)

  return(

    items.map((item, index) => {

      return(

        <div key={index} className={styles.HierarchicalMenuListItem}>

          <a
            className={styles.wrapper}
            href={createURL(item.value)}
            onClick={event => {
              event.preventDefault()
              refine(item.value)
              setIsToggle(!isToggle)
            }}
          >

            <input
              type='checkbox'
              className={styles.checkBox}
              id={item.label}
              name={item.label}
              checked={item.isRefined}
              readOnly
            />

            <label
              className={styles.label}
              htmlFor={item.label}
            >
              <div className={styles.left}>
                { item.label }
              </div>
              <div className={styles.right}>
                <div className={styles.number}>
                  { item.count }
                </div>
              </div>
            </label>

            <div
              className={styles.arrow}
              style={{
                transform: `rotate(${item.isRefined ? '-180deg' : '0deg'})`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </div>

          </a>

          {
            item.items ? (

              <ul
                style={{
                  maxHeight: item.items ? '1000px' : '0',
                  // margin: isToggle ? '15px 0' : '0'
                }}
              >
                <HierarchicalMenuList items={item.items} refine={refine} createURL={createURL} />
              </ul>

            ) : <></>
          }

        </div>

      )

    })

  )

}

export default HierarchicalMenuList
