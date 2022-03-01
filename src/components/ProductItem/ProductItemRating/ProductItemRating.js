import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './ProductItemRating.module.scss'


const ProductItemRating = props => {

  return(

    <div className={styles.ProductItemRating}>
      <FontAwesomeIcon icon="star" fixedWidth /> 4.3
    </div>

  )

}

export default ProductItemRating
