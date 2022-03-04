import React from 'react'
import { connectRefinementList } from 'react-instantsearch-dom'
import Separator from '../../UI/Separator/Separator'

import styles from './CustomRefinementList.module.scss'


const CustomRefinementList = ({ title, items, isFromSearch, refine, searchForItems, createURL, searchable, placeholder }) => {


  return(

    items.length > 0 ?
      <>

        <div className='col-12'>

          <h6>{ title }</h6>

          {
            searchable ?
              <div className={styles.CustomRefinementListItem}>
                <input
                  type='search'
                  className={styles.searchBar}
                  placeholder={placeholder}
                  onChange={event => searchForItems(event.currentTarget.value)}
                />
              </div> : null
          }

          {
            items.map(item => {

              return(

                <div key={item.value} className={styles.CustomRefinementListItem}>

                  <div
                    // href={createURL(item.value)}
                    className={styles.wrapper}
                    onClick={event => {
                      event.preventDefault()
                      refine(item.value)
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
                      className={`${styles.label} ${isFromSearch ? styles.bold : ''}`}
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

                  </div>

                </div>

              )

            })
          }

        </div>

        <div className='col-12'>
          <Separator color={'#fff'} />
        </div>

      </> : null

  )

}

export default connectRefinementList(CustomRefinementList)