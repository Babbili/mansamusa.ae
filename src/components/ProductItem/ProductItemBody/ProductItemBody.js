import React from 'react'
import Label from '../../UI/Label/Label'

import styles from './ProductItemBody.module.scss'


const ProductItemBody = ({ supplier, product }) => {

  return(

    <div className={styles.ProductItemBody}>

      <div className={styles.price}>
        {
          product.isDiscount ?
            product.discountPrice > 100 ?
            Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((product.discountPrice)*1.1) : Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.discountPrice + 10)
          :
          product.productPrice > 100 ?
            `${ Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((product.productPrice)*1.1)}` : `${ Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.productPrice + 10)}`
            
        }
        {
          product.isDiscount ?
            <div className={styles.discount}>
              { product.productPrice > 100 ?
               Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((product.productPrice)*1.1) :
               Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.productPrice + 10)
              }
            </div> : null
        }
      </div>

      {
        product.isDiscount ?
          <Label
            title={`${product.discount} off`}
          /> :
          null
      }

      {/*<div style={{width: '10px'}} />*/}

      {/*<AddToCart product={product} />*/}

      {
        // supplier ? null : <AddToCart />
      }

    </div>

  )

}

export default ProductItemBody
