import React from 'react'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../../../utils/utils'

import noImage from './../../../assets/noimage.jpg'
import styles from './ProductItemImage.module.scss'


const ProductItemImage = ({ url, lang, product, isMobile }) => {


  return(

    <div
      className={styles.ProductItemImage}
    >
      <Link to={url}>
        <img
          src={product.productImages.length > 0 ? product.productImages[0].url : noImage}
          alt={ product.productName[lang] }
        />
      </Link>
    </div>

  )

}

export default ProductItemImage
