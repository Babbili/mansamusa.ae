import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Link } from 'react-router-dom'
// import { toSlug } from '../../utils/toSlug'

import styles from './BreadCrumbs.module.scss'


const BreadCrumbs = ({ path }) => {

  return (

    <div className={`${styles.BreadCrumbs} row`}>

      <div className='col-12 d-flex'>

        {
          path.map((item, index) => {

            // let url = [...path]
            // let newPath = url.slice(0, index + 1).map(m => toSlug(m))
            // let newUrl = `/categories${newPath.join('')}`

            return (

              <div
                key={index}
                className={styles.item}
              >
                {/*<Link to={newUrl}>*/}
                {/*  { item }*/}
                {/*</Link>*/}
                { item }
                <FontAwesomeIcon icon="angle-right" fixedWidth />
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default BreadCrumbs
