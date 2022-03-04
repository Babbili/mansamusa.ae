import React from 'react'
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
              </div>

            )

          })
        }

      </div>

    </div>

  )

}

export default BreadCrumbs
