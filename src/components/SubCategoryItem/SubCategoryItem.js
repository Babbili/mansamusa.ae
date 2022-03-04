import React from 'react'

import styles from './SubCategoryItem.module.scss'
import img from '../../assets/homenart.jpg'


const SubCategoryItem = ({ category, length, col, num }) => {

  return(

    <div className={`${styles.SubCategoryItem} col-${col}`}>

      <div className={styles.wrapper}>

        <div className={styles.CategoryImage}>

          <div className={styles.title}>
            { category.title }
          </div>

          <a href="/">
            <img src={category.imgUrl} alt='product' />
          </a>

        </div>

      </div>

    </div>

  )

}

export default SubCategoryItem
