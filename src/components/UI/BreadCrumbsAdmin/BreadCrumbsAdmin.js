import React, { useContext } from 'react'
import AppContext from '../../AppContext'

import styles from './BreadCrumbsAdmin.module.scss'


const BreadCrumbsAdmin = props => {

  const context = useContext(AppContext)
  let { lang } = context
  let { bc } = props

  return (

    <div className={`${styles.BreadCrumbsAdmin}`}>

      <div className='col-12 d-flex'>

        <div
          className={styles.item}
          onClick={() => props.history.go(`-${bc.length}`)}
        >
          <span>
            Top categories
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
        </div>

        {
          bc.map((item, index) => {

            return (

              <div
                key={index}
                className={styles.item}
                onClick={() => {
                  if (index !== bc.length - 1) {
                    props.history.go(`-${bc.length - index - 1}`)
                  }
                }}
              >
                <span>
                  { item.title[lang] }
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default BreadCrumbsAdmin
