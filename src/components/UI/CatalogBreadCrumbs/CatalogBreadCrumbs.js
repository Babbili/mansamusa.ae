import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toSlug } from '../../utils/toSlug'

import styles from './CatalogBreadCrumbs.module.scss'


const CatalogBreadCrumbs = ({ path }) => {

  // let currPath = [...path]
  // currPath.length = currPath.length - 1

  return (

    <div className={`${styles.CatalogBreadCrumbs} row`}>

      <div className='col-12 d-flex'>

        <div
          className={styles.item}
          onClick={window.scroll(0, 0)}
        >
          <Link to={'/'}>
            Home
          </Link>
          <FontAwesomeIcon icon="angle-right" fixedWidth />
        </div>

        {
          path.map((item, index) => {

            let url = [...path]
            let newPath = url.slice(0, index + 1).map(m => toSlug(m))
            let newUrl = `/categories${newPath.join('')}`

            return (

              <div
                key={index}
                className={styles.item}
                onClick={window.scroll(0, 0)}
              >
                <Link to={newUrl}>
                  { item }
                </Link>
                <FontAwesomeIcon icon="angle-right" fixedWidth />
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default CatalogBreadCrumbs
