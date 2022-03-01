import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
          <FontAwesomeIcon icon="angle-right" fixedWidth />
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
                <FontAwesomeIcon icon="angle-right" fixedWidth />
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default BreadCrumbsAdmin
