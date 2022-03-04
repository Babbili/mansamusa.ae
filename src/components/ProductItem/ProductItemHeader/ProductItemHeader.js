import React from 'react'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../../../utils/utils'

import styles from './ProductItemHeader.module.scss'


const ProductItemHeader = ({ url, lang, supplier, product }) => {


  return(

    <div className={styles.ProductItemHeader}>

      <div className={styles.title}>
        <a  onClick={()=> window.location=`${url}`}>
          {/*{ product.productName[lang].substring(0, 20) + '...' }*/}
          { product.productName[lang] }
        </a>
      </div>

      {/*<div style={{width: '10px'}} />*/}

      {/*<AddToFavourites product={product} />*/}
      {
        // supplier ? null : <AddToFavourites />
      }

    </div>

  )

}

export default ProductItemHeader
