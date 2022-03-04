import React from 'react'
import { Link } from 'react-router-dom'
import { toSlug } from '../utils/toSlug'

import styles from './CategoryItem.module.scss'


const CategoryItem = ({ category, length, col, num, url, link }) => {

  return(

    <div className={`${styles.CategoryItem} col-${col}`}>

      <div className={styles.wrapper} onClick={() => window.scrollTo(0, 0)}>

        <Link to={`${url}${toSlug(link)}${toSlug(category.title)}`}>

          <div
            className={styles.CategoryImage}
            style={{
              backgroundImage: `url(${category.imgUrl})`
            }}
          >

            <div className={styles.title}>
              { category.title }
            </div>

          </div>

        </Link>

      </div>

    </div>

  )

}

export default CategoryItem
