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
              <FontAwesomeIcon icon="arrow-down" fixedWidth />
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
