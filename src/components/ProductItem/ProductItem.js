import React, { useContext } from 'react'
import AppContext from '../AppContext'
import { toSlug } from '../utils/toSlug'
import ProductItemBody from './ProductItemBody/ProductItemBody'
import ProductItemImage from './ProductItemImage/ProductItemImage'
import ProductItemHeader from './ProductItemHeader/ProductItemHeader'
import ProductItemAddToFavourites from './ProductItemAddToFavourites/ProductItemAddToFavourites'

// import ProductItemRating from './ProductItemRating/ProductItemRating'

import styles from './ProductItem.module.scss'


const ProductItem = ({ mb, product }) => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context
  let productUrl = '/details' + toSlug(product.productName) + '-' + product.id


  return(

    <div className={styles.ProductItem}>
    
        {/*<ProductItemRating />*/}

        <ProductItemAddToFavourites
          product={product}
        />

        {
          // supplier ? null : <ProductItemAddToFavourites />
        }

        <ProductItemImage
          lang={lang}
          url={productUrl}
          product={product}
          isMobile={isMobile}
        />

        <div className={styles.productDetails}>

          <ProductItemHeader
            supplier
            lang={lang}
            url={productUrl}
            product={product}
          />

          <ProductItemBody
            lang={lang}
            supplier
            product={product}
          />

        </div>

    </div>

  )

}

export default ProductItem
