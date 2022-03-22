import React from 'react'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../../../utils/utils'

import noImage from './../../../assets/noimage.jpg'
import styles from './ProductItemImage.module.scss'


const ProductItemImage = ({ url, lang, product }) => {

  return(


    <div className={styles.ProductItemImage} 
    style={{ 
      backgroundImage: `url(${product.productImages.length > 0 ? product.productImages[0].url : noImage})` 
    }}>
      <a  onClick={()=> window.location=`${url}`} >
        {/*<img
          src={product.productImages.length > 0 ? product.productImages[0].url : noImage}
          alt={ product.productName[lang] }
        />*/}
        &nbsp;

      </a>
    </div>

  )

}

export default ProductItemImage
