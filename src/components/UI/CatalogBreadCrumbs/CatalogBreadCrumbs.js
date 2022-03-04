import React from 'react'
import { Link } from 'react-router-dom'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default CatalogBreadCrumbs
